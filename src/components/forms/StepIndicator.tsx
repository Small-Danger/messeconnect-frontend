interface StepIndicatorProps {
  current: number;
  total?: number;
  labels?: string[];
}

export function StepIndicator({ current, total = 4, labels }: StepIndicatorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div
              className={[
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
                step <= current ? 'bg-teal text-white' : 'bg-gray-200 text-gray-500',
              ].join(' ')}
            >
              {step}
            </div>
            {step < total ? (
              <div className={`flex-1 h-1 mx-1 rounded ${step < current ? 'bg-teal' : 'bg-gray-200'}`} />
            ) : null}
          </div>
        ))}
      </div>
      {labels ? (
        <p className="text-sm text-center text-gray-600 font-medium">{labels[current - 1]}</p>
      ) : (
        <p className="text-sm text-center text-gray-500">
          Étape {current} sur {total}
        </p>
      )}
    </div>
  );
}
