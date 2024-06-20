import { AnimatePresence, HTMLMotionProps, Variant, Variants, motion } from "framer-motion"
import { useEffect, useState } from "react"

// Possible states for the button
type Status = "initial" | "confirmation" | "success"

// Possible backgrounds for the parent button, the initial state and the final state are handled by the parent
const bgVariants: Partial<Record<Status, Variant>> = {
  confirmation: { backgroundColor: 'var(--color-warning)' },
  success: { backgroundColor: 'var(--color-success)' },
}

// These variants handles the in and out animations and also the styles that the visible button has to have
const presenceVariants: Variants = {
  initial: { opacity: 0, y: -100, position: "relative", width: "100%" },
  visible: { opacity: 1, y: 0, position: "relative", width: "100%" },
  hidden: { opacity: 0, y: 100, position: "relative", width: "100%" },
}

function ButtonWithConfirmation({ children, onClick, className = '', ...props }: HTMLMotionProps<"button">) {
  const [status, setStatus] = useState<Status>("initial")

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (status === "initial") {
      setStatus("confirmation")
    } else if (status === "confirmation") {
      setStatus("success")

      // We only call the original onClick event if the user confirms
      onClick?.(event)
    } else if (status === "success") {
      setStatus("initial")
    }
  }

  useEffect(() => {
    let timeout: number;

    // A timeout for the confirmation state, if user didn't confirm after 3 seconds, go back to an initial state
    if (status === "confirmation") {
      timeout = setTimeout(() => setStatus("initial"), 3000)
    } else if (status === "success") {
      // After showing the success state for 2 seconds, go back to an initial state
      timeout = setTimeout(() => setStatus("initial"), 2000)
    }

    // Clear the timeout every time the status changes
    return () => clearTimeout(timeout)
  }, [status])

  return (
    <AnimatePresence initial={false}>
      <motion.button
        // Ensure we set `layout` in the parent button as the width changes between transitions. Otherwise the button will jump between states
        // In this example you won't see the jump because we set a min-width in the button, remove it if you want to see it
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

        {/* confirmation */}
        {status === "confirmation" && (
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
              initial={{ width: '100%', left: '0px', height: '100%', backgroundColor: "#f59e0b" }}
              animate={status === "confirmation"
                ? { width: '0%', transition: { duration: 3, ease: 'linear' } }
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
        // We just set a zoom so it's easier to see the button
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
