import { AnimatePresence, HTMLMotionProps, Variant, Variants, motion } from "framer-motion"
import { useEffect, useState } from "react"

type Status = "initial" | "prompted" | "success"

const bgVariants: Partial<Record<Status, Variant>> = {
  prompted: { backgroundColor: 'var(--color-warning)' },
  success: { backgroundColor: 'var(--color-success)' },
}
const presenceVariants: Variants = {
  initial: { opacity: 0, y: -100, position: "relative", width: "100%" },
  visible: { opacity: 1, y: 0, position: "relative", width: "100%" },
  hidden: { opacity: 0, y: 100, position: "relative", width: "100%" },
}

function ButtonWithConfirmation({ children, onClick, className = '', ...props }: HTMLMotionProps<"button">) {
  const [status, setStatus] = useState<Status>("initial")

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (status === "initial") {
      setStatus("prompted")
    } else if (status === "prompted") {
      setStatus("success")
      onClick?.(event)
    } else if (status === "success") {
      setStatus("initial")
    }
  }

  useEffect(() => {
    let timeout: number;

    if (status === "prompted") {
      timeout = setTimeout(() => setStatus("initial"), 3000)
    } else if (status === "success") {
      timeout = setTimeout(() => {
        setStatus("initial")
      }, 2000)
    }

    return () => clearTimeout(timeout)
  }, [status])

  return (
    <AnimatePresence initial={false}>
      <motion.button
        layout
        className={`overflow-hidden min-w-32 text-white rounded-full relative origin-top flex items-center justify-center py-2 ${className}`}
        initial="initial"
        animate={status}
        variants={bgVariants}
        onClick={handleClick}
        {...props}
      >
        {/* initial */}
        {status === "initial" && (
          <motion.p
            className="flex items-center justify-center px-4"
            initial="initial"
            variants={presenceVariants}
            animate="visible"
            exit="hidden"
          >
            {children}
          </motion.p>
        )}

        {/* prompted? */}
        {status === "prompted" && (
          <motion.p
            className="flex items-center justify-center px-4"
            initial="initial"
            variants={presenceVariants}
            animate="visible"
            exit="hidden"
          >
            <motion.span className="z-10">
              Confirm?
            </motion.span>
            <motion.span
              className="absolute py-8"
              initial={{ width: '0%', left: '0px', height: '100%', backgroundColor: "#0000002f" }}
              animate={status === "prompted"
                ? { width: '100%', transition: { duration: 3, ease: 'linear' } }
                : { opacity: 0, width: '0%', transition: { duration: 0 } }}
            />
          </motion.p>
        )}

        {/* success */}
        {status === "success" && (
          <motion.p
            className="flex items-center justify-center px-8"
            initial="initial"
            variants={presenceVariants}
            animate="visible"
            exit="hidden"
          >
            ✓
          </motion.p>
        )}
      </motion.button>
    </AnimatePresence>
  )
}

function App() {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)

  return (
    <ButtonWithConfirmation
      style={{
        zoom: 5,
        backgroundColor: isSubscribed
          ? 'var(--color-secondary)'
          : 'var(--color-primary)'
      }}
      onClick={() => setIsSubscribed(subscribed => !subscribed)}
    >
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </ButtonWithConfirmation>
  )
}

export default App
