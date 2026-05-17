import styles from './StepperSection.module.css'

/**
 * StepperSection — horizontal step indicator bar
 * steps:        [{ label }]
 * currentStep:  1-based index of the ACTIVE step
 */
export default function StepperSection({ steps, currentStep = 1 }) {
  const progressPct = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className={styles.wrapper} role="list" aria-label="שלבי התהליך">
      {/* Background track */}
      <div className={styles.track} aria-hidden="true" />

      {/* Progress fill */}
      <div
        className={styles.progress}
        aria-hidden="true"
        style={{ width: `${progressPct}%` }}
      />

      {/* Steps */}
      <div className={styles.steps}>
        {steps.map((step, i) => {
          const stepNum = i + 1
          const isDone   = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isPending = stepNum > currentStep

          return (
            <div
              key={step.label}
              className={`${styles.step} ${isPending ? styles.pending : ''}`}
              role="listitem"
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Circle */}
              <div
                className={`${styles.circle} ${
                  isDone   ? styles.circleDone   :
                  isActive ? styles.circleActive :
                             styles.circlePending
                }`}
              >
                {isDone ? (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16, fontVariationSettings: "'wght' 700" }}
                  >
                    check
                  </span>
                ) : (
                  <span className={styles.stepNum}>{stepNum}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`${styles.label} ${
                  isDone || isActive ? styles.labelActive : styles.labelPending
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
