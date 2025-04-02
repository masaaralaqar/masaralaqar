
import React from "react";
import { cn } from "@/lib/utils";
import { Step, StepId } from "./types";
import { Check } from "lucide-react";

interface StepNavigationProps {
  steps: Step[];
  currentStep: StepId;
  completedSteps: Set<StepId>;
  goToStep?: (stepId: StepId) => void;
}

export function StepNavigation({ 
  steps, 
  currentStep, 
  completedSteps,
  goToStep
}: StepNavigationProps) {
  const handleStepClick = (stepId: StepId) => {
    // Only allow clicking on completed steps
    if (completedSteps.has(stepId) && goToStep) {
      goToStep(stepId);
    }
  };

  return (
    <div className="relative mb-8">
      <div className="overflow-hidden">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.has(step.id);
            const isLast = index === steps.length - 1;
            const isClickable = isCompleted && goToStep;
            
            return (
              <React.Fragment key={step.id}>
                <div 
                  className={cn(
                    "flex flex-col items-center",
                    isClickable && "cursor-pointer"
                  )}
                  onClick={() => handleStepClick(step.id)}
                >
                  {/* Step circle */}
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all relative z-10",
                      isActive && "bg-primary text-primary-foreground border-primary ring-2 ring-primary/30",
                      isCompleted && "bg-primary text-primary-foreground border-primary",
                      !isActive && !isCompleted && "bg-muted border-muted-foreground text-muted-foreground",
                      isClickable && "hover:ring-2 hover:ring-primary/30"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span className="text-lg">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Step title */}
                  <div className={cn(
                    "mt-2 font-medium",
                    isActive && "text-primary",
                    isCompleted && "text-primary",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}>
                    {step.title}
                  </div>
                </div>
                
                {/* Connector line */}
                {!isLast && (
                  <div className="flex-1 mx-2">
                    <div 
                      className={cn(
                        "h-1 transition-colors",
                        (isCompleted || (isActive && index > 0)) ? "bg-primary" : "bg-muted"
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
