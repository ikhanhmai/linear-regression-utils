"use client";

import React, { useState } from 'react';
import { InfoIcon } from 'lucide-react';
import {
  useFloating,
  useInteractions,
  useHover,
  useRole,
  offset,
  flip,
  shift,
  arrow,
  FloatingPortal,
  FloatingArrow,
} from '@floating-ui/react';

interface TooltipProps {
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = React.useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [
      offset(8),
      flip(),
      shift(),
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(context, {
    move: false,
  });
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    role,
  ]);

  // Format multiline content
  const formattedContent = content.split('\n').map(line => line.trim()).join('\n');

  return (
    <>
      <button
        ref={refs.setReference}
        className="text-gray-400 hover:text-gray-600 transition-colors ml-1 focus:outline-none"
        {...getReferenceProps()}
      >
        <InfoIcon className="h-4 w-4" />
      </button>

      <FloatingPortal>
        {isOpen && (
          <div
            ref={refs.setFloating}
            className="z-[9999]"
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div className="relative bg-white text-gray-700 rounded-lg shadow-lg p-3 text-sm border border-gray-200 min-w-[16rem] max-w-xs">
              <div className="whitespace-pre-line">
                {formattedContent}
              </div>
              <FloatingArrow
                ref={arrowRef}
                context={context}
                className="fill-white"
                tipRadius={1}
              />
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
};
