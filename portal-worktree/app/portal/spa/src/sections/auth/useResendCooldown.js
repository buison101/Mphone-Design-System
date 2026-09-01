import { useCallback, useEffect, useRef, useState } from 'react';

// ==============================|| AUTH - RESEND COOLDOWN ||============================== //
//
// Bước 3 of the identity plan asks for rate limits on verify, resend and
// recovery. A rate limit the reader cannot see is a button that works until it
// suddenly does not, so the countdown is drawn rather than left to the server to
// refuse.
//
// The number here is the interface's promise, not the enforcement: the server
// still has to refuse an early request, because nothing in the browser is a
// control. What this buys is that an honest reader never trips the limit.

export default function useResendCooldown(seconds = 60) {
  const [remaining, setRemaining] = useState(0);
  const timer = useRef(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    []
  );

  const start = useCallback(() => {
    setRemaining(seconds);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer.current);
          timer.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  return { remaining, start, active: remaining > 0 };
}
