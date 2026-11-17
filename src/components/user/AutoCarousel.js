import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/light-glass.css";

export default function AutoCarousel({ items = [], renderItem, interval = 4000 }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setI(v => (v + 1) % items.length), interval);
    return () => clearInterval(t);
  }, [items, interval]);

  if (!items.length) return null;
  const current = items[i];

  return (
    <div className="featured p-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}
          transition={{duration:.35}}
        >
          {renderItem(current, i)}
        </motion.div>
      </AnimatePresence>

      <div className="dots">
        {items.map((_, idx)=>(
          <span key={idx} className={`dot ${idx===i?'active':''}`} onClick={()=>setI(idx)} />
        ))}
      </div>
    </div>
  );
}
