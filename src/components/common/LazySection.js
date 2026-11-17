import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LazySection({ children, from = "20px", delay = 0 }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && setShow(true)),
      { threshold: 0.12 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: from }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
