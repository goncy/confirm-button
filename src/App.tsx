import {HTMLMotionProps, motion} from "framer-motion"
import { useEffect, useState } from "react"

function ButtonWithConfirmation({children, onClick, ...props}: HTMLMotionProps<"button">) {
  const [status, setStatus] = useState<"initial" | "prompted" | "success" | "completed">("initial")

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (status === "initial") {
      setStatus("prompted")
    } else if (status === "prompted") {
      setStatus("success")
      onClick?.(event)
    } else if (status === "success") {
      setStatus("completed")
    } else if (status === "completed") {
      setStatus("initial")
    }
  }

  useEffect(() => {
    let timeout: number;

    if (status === "prompted") {
      timeout = setTimeout(() => setStatus("initial"), 3000)
    } else if (status === "success") {
      timeout = setTimeout(() => {
        setStatus("completed")
      }, 2000)
    }
    
    return () => clearTimeout(timeout)
  }, [status])

  return (
    <motion.button
      className="overflow-hidden text-white rounded-full relative origin-top flex items-center justify-center py-2 px-8"
      initial={{backgroundColor: 'var(--color-primary)'}}
      animate={{
        backgroundColor:
          status === "success"
            ? 'var(--color-success)'
            : status === "prompted"
              ? 'var(--color-warning)'
              : status === "completed"
                ? 'var(--color-secondary)'
                : 'var(--color-primary)'
      }}
      onClick={handleClick}
      {...props}
    >
      {/* initial */}
      <motion.p
        className="flex items-center justify-center"
        initial={{y: 0, opacity: 1}}
        animate={status === "initial" ? {y: 0, opacity: 1} : {y: 100, opacity: 0}}
      >
        {children}
      </motion.p>

      {/* prompted? */}
      <motion.p
        className="w-full h-full absolute flex items-center justify-center"
        initial={{y: -100, opacity: 0}}
        animate={["initial", "completed"].includes(status)
          ? {y: -100, opacity: 0}
          : status === "prompted"
            ? {y: 0, opacity: 1}
            : {y: 100, opacity: 0}}
      >
          <motion.span className="z-10">
            Confirm?
          </motion.span>
          <motion.span
            className="absolute py-8"
            initial={{width: '0%', left: '0px', height: '100%', backgroundColor: "#0000002f"}}
            animate={status === "prompted"
              ? {width: '100%', height: '100%', transition: {duration: 3, ease: 'linear'}}
              : ["success", "initial"].includes(status)
                ? {opacity: 0, transition: {duration: 0}}
                : {width: '0%', height: '100%'}}
          />
      </motion.p>

      {/* success */}
      <motion.p
        className="w-full h-full absolute flex items-center justify-center text-xl"
        initial={{y: -100, opacity: 0}}
        animate={["prompted"].includes(status)
          ? {y: -100, opacity: 0}
          : status === "success"
            ? {y: 0, opacity: 1}
            : {y: 100, opacity: 0}}
      >
        ✓
      </motion.p>

      {/* completed */}
      <motion.p
        className="w-full h-full absolute flex items-center justify-center"
        initial={{y: -100, opacity: 0}}
        animate={["success"].includes(status)
          ? {y: -100, opacity: 0}
          : status === "completed"
            ? {y: 0, opacity: 1}
            : {y: -100, opacity: 0}}
      >
        Subscribed
      </motion.p>
    </motion.button>
  )
}

function App() {
  return (
    <ButtonWithConfirmation onClick={() => console.log("Confirmed!")}>
      Subscribe
    </ButtonWithConfirmation>
  )
}

export default App
