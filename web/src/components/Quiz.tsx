import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'

import type { Quiz as QuizType } from '../types'
import { cn } from './ui'

export function Quiz({ quiz }: { quiz: QuizType }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const correct = selected === quiz.correctIndex

  return (
    <div className="rounded-2xl border border-line bg-panel/60 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-foam">Quiz del día</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
          1 pregunta
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-foam/85">{quiz.prompt}</p>

      <div className="mt-4 space-y-2" role="group" aria-label="Opciones del quiz">
        {quiz.options.map((option, index) => {
          const isSelected = selected === index
          const isCorrect = index === quiz.correctIndex
          const showResult = answered
          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                if (answered) return
                setSelected(index)
                setAnswered(true)
              }}
              disabled={answered}
              aria-pressed={isSelected}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
                !showResult && 'border-line bg-ink/30 text-foam/80 hover:border-sion/40 hover:bg-panel-2',
                showResult && isCorrect && 'border-sion/50 bg-sion/10 text-foam',
                showResult && isSelected && !isCorrect && 'border-rose-400/50 bg-rose-400/10 text-foam',
                showResult && !isSelected && !isCorrect && 'border-line bg-ink/20 text-mist',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border font-mono text-[10px] font-semibold',
                  !showResult && 'border-line text-mist',
                  showResult && isCorrect && 'border-sion bg-sion text-ink',
                  showResult && isSelected && !isCorrect && 'border-rose-400 bg-rose-400 text-ink',
                  showResult && !isSelected && !isCorrect && 'border-line text-mist',
                )}
              >
                {showResult && isCorrect ? (
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                ) : showResult && isSelected ? (
                  <X className="size-3" strokeWidth={3} aria-hidden="true" />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </span>
              <span className="leading-6">{option}</span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {answered ? (
          <div
            className={cn(
              'mt-3 rounded-xl border px-3 py-2.5 text-sm leading-6',
              correct
                ? 'border-sion/30 bg-sion/8 text-foam/85'
                : 'border-amber/30 bg-amber/8 text-foam/85',
            )}
          >
            <p className="font-semibold text-foam">{correct ? 'Correcto.' : 'Casi.'}</p>
            <p className="mt-0.5">{quiz.explanation}</p>
          </div>
        ) : null}
      </div>

      {answered ? (
        <button
          type="button"
          onClick={() => {
            setAnswered(false)
            setSelected(null)
          }}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-mist transition-colors hover:text-sion"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Intentar de nuevo
        </button>
      ) : null}
    </div>
  )
}
