"use client";

import { Box } from "@chakra-ui/react";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

const getRangePercent = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value) || max <= min) {
    return 0;
  }
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

export interface PriceRangeControlProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (_value: [number, number]) => void;
  onCommit: (_value: [number, number]) => void;
}

export const PriceRangeControl = memo(
  ({ min, max, value, onChange, onCommit }: PriceRangeControlProps) => {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [activeHandle, setActiveHandle] = useState<"min" | "max" | null>(null);
    const lowerValue = Math.min(value[0], value[1]);
    const upperValue = Math.max(value[0], value[1]);
    const lowerPercent = getRangePercent(lowerValue, min, max);
    const upperPercent = getRangePercent(upperValue, min, max);
    const step = Math.max(1, Math.round((max - min) / 100));

    const getValueFromClientX = useCallback(
      (clientX: number) => {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect || rect.width <= 0) {
          return min;
        }
        const percentage = Math.min(
          1,
          Math.max(0, (clientX - rect.left) / rect.width)
        );
        return Math.round(min + percentage * (max - min));
      },
      [max, min]
    );

    const getNextRange = useCallback(
      (nextValue: number, handle: "min" | "max"): [number, number] => {
        if (handle === "min") {
          return [Math.min(nextValue, upperValue), upperValue];
        }
        return [lowerValue, Math.max(nextValue, lowerValue)];
      },
      [lowerValue, upperValue]
    );

    const updateFromClientX = useCallback(
      (clientX: number, handle: "min" | "max") => {
        const nextRange = getNextRange(getValueFromClientX(clientX), handle);
        onChange(nextRange);
        return nextRange;
      },
      [getNextRange, getValueFromClientX, onChange]
    );

    useEffect(() => {
      if (!activeHandle) {
        return undefined;
      }

      const handlePointerMove = (event: PointerEvent) => {
        updateFromClientX(event.clientX, activeHandle);
      };
      const handlePointerUp = (event: PointerEvent) => {
        const nextRange = updateFromClientX(event.clientX, activeHandle);
        onCommit(nextRange);
        setActiveHandle(null);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }, [activeHandle, onCommit, updateFromClientX]);

    const startDrag = (event: any, handle: "min" | "max") => {
      event.currentTarget?.focus?.();
      event.preventDefault();
      setActiveHandle(handle);
      updateFromClientX(event.clientX, handle);
    };

    const handleTrackPointerDown = (event: any) => {
      const nextValue = getValueFromClientX(event.clientX);
      const handle =
        Math.abs(nextValue - lowerValue) <= Math.abs(nextValue - upperValue)
          ? "min"
          : "max";
      startDrag(event, handle);
    };

    const handleKeyDown = (event: any, handle: "min" | "max") => {
      if (
        !["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"].includes(event.key)
      ) {
        return;
      }
      event.preventDefault();
      const direction =
        event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1;
      const currentValue = handle === "min" ? lowerValue : upperValue;
      const nextRange = getNextRange(currentValue + direction * step, handle);
      onChange(nextRange);
      onCommit(nextRange);
    };

    return (
      <Box position="relative" h="28px" mb={2} pt="12px" px={1}>
        <Box
          ref={trackRef}
          position="relative"
          h="5px"
          borderRadius="full"
          bg="var(--color-border, #E2E8F0)"
          cursor="pointer"
          onPointerDown={handleTrackPointerDown}
        >
          <Box
            position="absolute"
            left={`${lowerPercent}%`}
            right={`${100 - upperPercent}%`}
            top={0}
            h="5px"
            borderRadius="full"
            bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
          />
          {[
            {
              key: "min" as const,
              value: lowerValue,
              percent: lowerPercent,
              label: "Minimum price",
            },
            {
              key: "max" as const,
              value: upperValue,
              percent: upperPercent,
              label: "Maximum price",
            },
          ].map((handle) => (
            <Box
              key={handle.key}
              role="slider"
              aria-label={handle.label}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={handle.value}
              tabIndex={0}
              position="absolute"
              left={`${handle.percent}%`}
              top="50%"
              transform="translate(-50%, -50%)"
              boxSize="18px"
              borderRadius="full"
              bg="white"
              border="2.5px solid"
              borderColor="var(--color-primary)"
              boxShadow="0 2px 6px rgba(6, 95, 104, 0.35)"
              cursor="grab"
              zIndex={handle.key === "min" ? 2 : 3}
              _active={{
                cursor: "grabbing",
                transform: "translate(-50%, -50%) scale(1.15)",
              }}
              transition="transform 0.1s ease"
              onPointerDown={(event) => startDrag(event, handle.key)}
              onKeyDown={(event) => handleKeyDown(event, handle.key)}
            />
          ))}
        </Box>
      </Box>
    );
  }
);

PriceRangeControl.displayName = "PriceRangeControl";
