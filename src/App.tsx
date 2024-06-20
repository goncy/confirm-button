import {HTMLMotionProps, Variant, Variants, motion} from "framer-motion"
import { useEffect, useState } from "react"

type Status = "initial" | "prompted" | "success" | "completed"

const bgVariants: Record<Status, Variant> = {
  initial: {backgroundColor: 'var(--color-primary)'},
  prompted: {backgroundColor: 'var(--color-warning)'},
  success: {backgroundColor: 'var(--color-success)'},
  completed: {backgroundColor: 'var(--color-secondary)'},
}
const presenceVariants: Variants = {
  visible: {opacity: 1, y: 0},
  hidden: {opacity: 0, y: 100},
}

function ButtonWithConfirmation({children, onClick, ...props}: HTMLMotionProps<"button">) {
  const [status, setStatus] = useState<Status>("initial")

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
      initial="initial"
      animate={status}
      variants={bgVariants}
      onClick={handleClick}
      {...props}
    >
      {/* initial */}
      <motion.p
        className="flex items-center justify-center"
        initial="visible"
        variants={presenceVariants}
        animate={status === "initial" ? "visible" : "hidden"}
      >
        {children}
      </motion.p>

      {/* prompted? */}
      <motion.p
        className="w-full h-full absolute flex items-center justify-center"
        initial="hidden"
        variants={presenceVariants}
        animate={status === "prompted" ? "visible" : "hidden"}
      >
          <motion.span className="z-10">
            Confirm?
          </motion.span>
          <motion.span
            className="absolute py-8"
            initial={{width: '0%', left: '0px', height: '100%', backgroundColor: "#0000002f"}}
            animate={status === "prompted"
              ? {width: '100%', transition: {duration: 3, ease: 'linear'}}
              : {opacity: 0, width: '0%', transition: {duration: 0}}}
          />
      </motion.p>

      {/* success */}
      <motion.p
        className="w-full h-full absolute flex items-center justify-center text-xl"
        initial="hidden"
        variants={presenceVariants}
        animate={status === "success" ? "visible" : "hidden"}
      >
        ✓
      </motion.p>

      {/* completed */}
      <motion.p
        className="w-full h-full absolute flex items-center justify-center"
        initial="hidden"
        variants={presenceVariants}
        animate={status === "completed" ? "visible" : "hidden"}
      >
        Subscribed
      </motion.p>
    </motion.button>
  )
}

function App() {
  return (
    <ButtonWithConfirmation style={{zoom: 5}} onClick={() => console.log("Confirmed!")}>
      Subscribe
    </ButtonWithConfirmation>
  )
}

export default App
