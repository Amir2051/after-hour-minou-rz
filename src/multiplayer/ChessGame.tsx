import React, { useEffect, useMemo, useState } from 'react';
import { Chess, type Square } from 'chess.js';
import { ArrowLeft, Crown, ShieldCheck, LoaderCircle } from 'lucide-react';
import { useAuthUser } from '../auth/AuthContext';
import { getFirestoreDb, serverTimestamp } from './firestore';

type SavedMove = { san: string; explanation: string; color: 'w'|'b'; from: string; to: string };
const PIECES: Record<string,string> = { wk:'♔', wq:'♕', wr:'♖', wb:'♗', wn:'♘', wp:'♙', bk:'♚', bq:'♛', br:'♜', bb:'♝', bn:'♞', bp:'♟' };
const FILES = 'abcdefgh';
const pieceNames: Record<string,string> = { p:'pawn', n:'knight', b:'bishop', r:'rook', q:'queen', k:'king' };

function explainMove(move: any, chess: Chess): string {
  const side = move.color === 'w' ? 'White' : 'Black';
  const name = pieceNames[move.piece] || 'piece';
  const destination = `${move.to[0].toUpperCase()}${move.to[1]}`;
  let text = `${side} moves the ${name} from ${move.from.toUpperCase()} to ${destination}. `;
  if (move.captured) text += `It captures the opponent's ${pieceNames[move.captured]}, removing that piece from the board. `;
  else if (move.piece === 'p') text += 'The pawn advances to gain space and help control the squares ahead. ';
  else if (move.piece === 'n') text += 'The knight jumps into a new position, where it can attack from unexpected angles and influence nearby central squares. ';
  else if (move.piece === 'b') text += 'The bishop takes a diagonal line across the board, increasing pressure along that diagonal. ';
  else if (move.piece === 'r') text += 'The rook takes a straight line along its rank or file, helping control open lanes. ';
  else if (move.piece === 'q') text += 'The queen becomes active across ranks, files, and diagonals, increasing attacking options. ';
  else if (move.piece === 'k') text += 'The king changes position to improve its safety or respond to the position. ';
  if (move.flags?.includes('k') || move.flags?.includes('q')) text += 'Castling also moves the king toward safety and brings the rook into play. ';
  if (move.promotion) text += `The pawn promotes to a ${pieceNames[move.promotion]}. `;
  if (chess.isCheckmate()) text += 'Checkmate! The opposing king is under attack and has no legal escape. ';
  else if (chess.isCheck()) text += 'This gives check: the opposing king is under direct threat and must respond. ';
  else if (chess.isDraw()) text += 'The position is a draw under the rules of chess. ';
  return text.trim();
}

interface Props { gameId: string; onExit: () => void; }
export const ChessGame: React.FC<Props> = ({ gameId, onExit }) => {
  const user = useAuthUser();
  const db = useMemo(() => getFirestoreDb(), []);
  const [game, setGame] = useState<any>(null);
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [flipped, setFlipped] = useState(false);

  useEffect(() => db.collection('chessGames').doc(gameId).onSnapshot((snapshot: any) => {
    if (snapshot.exists) { setGame({ id: snapshot.id, ...snapshot.data() }); setError(''); }
    else setError('This game could not be found.');
  }, (reason: any) => setError(reason.message || 'Could not sync the chess game.')), [db, gameId]);

  if (!user) return null;
  if (!game) return <div className="fixed inset-0 z-[95] flex items-center justify-center bg-[#090b18] text-violet-100"><LoaderCircle className="mr-3 animate-spin"/> Loading your board…</div>;
  const myColor: 'w'|'b' = game.whiteUid === user.uid ? 'w' : 'b';
  const myTurn = game.turnUid === user.uid && game.status === 'active';
  const chess = new Chess(game.fen);
  const board = chess.board();
  const files = flipped ? [...FILES].reverse() : [...FILES];
  const ranks = flipped ? [1,2,3,4,5,6,7,8] : [8,7,6,5,4,3,2,1];
  const history: SavedMove[] = game.moveHistory || [];
  const lastMove = history[history.length - 1];
  const currentName = game.turnUid === game.whiteUid ? game.whiteName : game.blackName;

  const chooseSquare = async (square: Square) => {
    if (!myTurn || busy) return;
    const current = new Chess(game.fen);
    const clicked = current.get(square);
    if (selected && legalTargets.includes(square)) {
      setBusy(true); setError('');
      try {
        const ref = db.collection('chessGames').doc(gameId);
        await db.runTransaction(async (transaction: any) => {
          const fresh = await transaction.get(ref);
          if (!fresh.exists) throw new Error('The game no longer exists.');
          const data = fresh.data();
          if (data.turnUid !== user.uid || data.status !== 'active') throw new Error('It is not your turn. The board has been updated.');
          const liveChess = new Chess(data.fen);
          const move = liveChess.move({ from: selected, to: square, promotion: 'q' });
          if (!move) throw new Error('That move is not legal.');
          const explanation = explainMove(move, liveChess);
          const moveEntry: SavedMove = { san: move.san, explanation, color: move.color, from: move.from, to: move.to };
          const nextUid = move.color === 'w' ? data.blackUid : data.whiteUid;
          const status = liveChess.isCheckmate() ? 'checkmate' : liveChess.isDraw() ? 'draw' : 'active';
          transaction.update(ref, {
            fen: liveChess.fen(), pgn: liveChess.pgn(), turnUid: status === 'active' ? nextUid : null,
            status, winnerUid: status === 'checkmate' ? (move.color === 'w' ? data.blackUid : data.whiteUid) : null, lastMove: moveEntry, moveHistory: window.firebase.firestore.FieldValue.arrayUnion(moveEntry), updatedAt: serverTimestamp(),
          });
        });
      } catch (reason: any) { setError(reason.message || 'Move could not be saved.'); }
      finally { setBusy(false); setSelected(null); setLegalTargets([]); }
      return;
    }
    if (clicked && ((clicked.color === 'w') === (myColor === 'w'))) {
      setSelected(square);
      setLegalTargets(current.moves({ square, verbose: true }).map((move: any) => move.to as Square));
    } else { setSelected(null); setLegalTargets([]); }
  };

  const resign = async () => {
    if (!window.confirm('Resign this chess game?')) return;
    setBusy(true);
    try { await db.collection('chessGames').doc(gameId).update({ status: 'resigned', winnerUid: myColor === 'w' ? game.blackUid : game.whiteUid, turnUid: null, updatedAt: serverTimestamp() }); }
    catch (reason: any) { setError(reason.message || 'Could not resign.'); }
    finally { setBusy(false); }
  };

  const statusText = game.status === 'checkmate' ? `Checkmate — ${game.winnerUid === user.uid ? 'you win' : 'you lose'}` : game.status === 'draw' ? 'Draw — game over' : game.status === 'resigned' ? `${game.winnerUid === user.uid ? 'You win' : 'You resigned'} — game over` : myTurn ? 'Your move' : `${currentName || 'Opponent'} is thinking`;
  return (
    <main className="after-hours-shell min-h-screen px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><button onClick={onExit} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"><ArrowLeft size={16}/> Back to games</button><div className="text-right"><p className="font-serif text-xl text-white">AFTER HOURS Chess</p><p className="text-xs text-violet-200">Live match · Two signed-in players</p></div></div>
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)]">
          <section className="glass-panel-glow rounded-3xl p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-slate-400">Black</p><p className="font-semibold text-white">{game.blackName || 'Opponent'}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">{game.blackUid===user.uid?'You play black':'Opponent plays black'}</span></div>
            <div className="mx-auto grid aspect-square w-full max-w-[680px] grid-cols-8 overflow-hidden rounded-xl border-4 border-[#302a42] shadow-2xl">
              {ranks.flatMap(rank => files.map(file => {
                const square = `${file}${rank}` as Square;
                const piece = board[8-rank][FILES.indexOf(file)];
                const light = (FILES.indexOf(file) + rank) % 2 === 0;
                const isSelected = selected === square;
                const isTarget = legalTargets.includes(square);
                const isLast = lastMove && (lastMove.from === square || lastMove.to === square);
                return <button key={square} onClick={()=>chooseSquare(square)} aria-label={`${square}${piece ? ` ${pieceNames[piece.type]}`:''}`} className={`relative flex aspect-square items-center justify-center ${light?'bg-[#e8d8bd]':'bg-[#8d6382]'} ${isSelected?'ring-4 ring-inset ring-amber-300':isLast?'after:absolute after:inset-0 after:bg-amber-300/20':''}`}>
                  {piece && <span className={`relative z-10 select-none text-[clamp(1.65rem,6.2vw,4.25rem)] leading-none ${piece.color==='w'?'text-[#fffdf5]':'text-[#171522]'}`} style={{fontFamily:'DejaVu Sans, Segoe UI Symbol, serif', textShadow:piece.color==='w'?'0 2px 2px #46384b, 0 0 3px #46384b':'0 1px 1px #e9d8c1'}}>{PIECES[`${piece.color}${piece.type}`]}</span>}
                  {isTarget && <span className={`absolute z-20 h-3 w-3 rounded-full ${piece?'border-4 border-emerald-500/80 bg-transparent':'bg-emerald-700/45'}`}/>}
                  {file==='a' && <span className={`absolute left-1 top-0.5 text-[9px] font-bold ${light?'text-[#8d6382]':'text-[#f2e6d6]'}`}>{rank}</span>}
                  {rank===(flipped?1:8) && <span className={`absolute bottom-0.5 right-1 text-[9px] font-bold ${light?'text-[#8d6382]':'text-[#f2e6d6]'}`}>{file}</span>}
                </button>;
              }))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-slate-400">White</p><p className="font-semibold text-white">{game.whiteName || 'Opponent'}</p></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">{game.whiteUid===user.uid?'You play white':'Opponent plays white'}</span></div>
            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${myTurn?'border-emerald-300/30 bg-emerald-500/10 text-emerald-100':'border-violet-300/20 bg-violet-500/10 text-violet-100'}`}><span className="mr-2 inline-block h-2 w-2 rounded-full bg-current"/>{statusText}</div>
            {error && <p role="alert" className="mt-3 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
            <div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>setFlipped(v=>!v)} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-200">Flip board</button>{myTurn && <button onClick={resign} disabled={busy} className="rounded-xl border border-rose-300/20 px-3 py-2 text-xs text-rose-200">Resign</button>}{busy&&<span className="flex items-center gap-2 text-xs text-violet-200"><LoaderCircle className="animate-spin" size={14}/> Syncing move…</span>}</div>
          </section>
          <aside className="space-y-5">
            <section className="glass-panel rounded-2xl p-5"><div className="flex items-center gap-2 text-violet-200"><Crown size={17}/><h2 className="font-serif text-xl text-white">The move, explained</h2></div>{lastMove ? <><p className="mt-3 text-sm font-bold text-white">{lastMove.color==='w'?'White':'Black'} played {lastMove.san}</p><p className="mt-2 text-sm leading-6 text-slate-300">{lastMove.explanation}</p></> : <p className="mt-3 text-sm leading-6 text-slate-400">Move explanations appear here in everyday language. Select one of your pieces, then select a highlighted square to make a legal move.</p>}<p className="mt-4 flex items-center gap-2 text-[11px] text-slate-500"><ShieldCheck size={14}/> Legal moves are checked with the chess rules engine.</p></section>
            <section className="glass-panel rounded-2xl p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-xl text-white">Move history</h2><span className="text-xs text-slate-500">{history.length} moves</span></div>{history.length===0?<p className="mt-3 text-sm text-slate-400">The opening position. White moves first.</p>:<ol className="mt-3 max-h-72 space-y-2 overflow-y-auto">{history.map((move,index)=><li key={`${index}-${move.san}`} className="rounded-lg border border-white/5 bg-black/15 px-3 py-2"><p className="text-xs font-bold text-violet-200">{index+1}. {move.color==='w'?'White':'Black'} · {move.san}</p><p className="mt-1 text-xs leading-5 text-slate-400">{move.explanation}</p></li>)}</ol>}</section>
            <div className="rounded-2xl border border-white/10 bg-black/15 p-4 text-xs leading-5 text-slate-400">The board updates live for both players. Pawn promotion currently defaults to a queen. Use the highlighted squares to see where a selected piece can legally move.</div>
          </aside>
        </div>
      </div>
    </main>
  );
};
