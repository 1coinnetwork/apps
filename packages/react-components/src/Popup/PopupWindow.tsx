// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

import { ElementPosition, useElementPosition } from '@polkadot/react-components/Popup/useElementPosition';

interface PopupWindowProps {
  position: 'left' | 'middle' | 'right',
  triggerPosition: ElementPosition,
}

const POINTER_OFFSET = 14 * 0.8;

function getHorizontalOffset (windowPosition: ElementPosition, position: 'left' | 'middle' | 'right') {
  if (position === 'left') {
    return windowPosition.width - POINTER_OFFSET;
  }

  if (position === 'right') {
    return POINTER_OFFSET;
  }

  return (windowPosition.width / 2);
}

function getVerticalOffset (triggerPosition: ElementPosition, position: 'top' | 'bottom', windowPosition: ElementPosition) {
  if (position === 'top') return (triggerPosition.height / 2 + windowPosition.height + POINTER_OFFSET) * -1;

  return triggerPosition.height / 2;
}

function getPosition (triggerPosition: ElementPosition, positionX: 'left' | 'middle' | 'right', positionY: 'top' | 'bottom', windowPosition?: ElementPosition) {
  if (!windowPosition) return { x: 0, y: 0 };

  return {
    x: triggerPosition.globalX - getHorizontalOffset(windowPosition, positionX),
    y: triggerPosition.globalY + getVerticalOffset(triggerPosition, positionY, windowPosition)
  };
}

export const PopupWindow: React.FC<PopupWindowProps> = ({ children, position, triggerPosition }) => {
  const ref = useRef<HTMLDivElement>();
  const windowPosition = useElementPosition(ref);

  return createPortal(
    <Window
      positionX={position}
      positionY={triggerPosition.verticalPosition}
      ref={ref}
      windowPosition={getPosition(triggerPosition, position, triggerPosition.verticalPosition, windowPosition)}
    >
      {children}
    </Window>,
    document.body
  );
};

interface WindowProps {
  positionX: 'left' | 'middle' | 'right',
  positionY: 'top' | 'bottom',
  windowPosition: { x: number, y: number },
}

const Window = styled.div<WindowProps>`
  position: absolute;
  top:0;
  left:0;
  z-index: 2;

  margin: 0.7rem 0;
  padding: 0.85rem 1rem;

  color: var(--color-text);
  background-color: var(--bg-menu);
  border-radius: 4px;
  border: 1px solid #d4d4d5;
  box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);

 transform: translate3d(${({ windowPosition }) =>
    `${windowPosition.x}px, ${windowPosition.y}px, 0`});

  &::before {
    position: absolute;
    right: 50%;
    top: unset;
    bottom: -0.3rem;
    box-shadow: 1px 1px 0 0 #bababc;

    ${({ positionY }) => positionY === 'bottom' && css`
      box-shadow: -1px -1px 0 0 #bababc;

      top: -0.3rem;
      bottom: unset;
    `}


    ${({ positionX }) => positionX === 'left' && css`
      left: unset;
      right: 0.8rem;
    `}

    ${({ positionX }) => positionX === 'right' && css`
      left: 0.8rem;
      right: unset;
    `}

    content: '';

    background-color: var(--bg-menu);

    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    z-index: 2;
    }

  .ui.text.menu .item {
    color: var(--color-text) !important;
    text-align: left;

    &.disabled {
     opacity: 0.3;
    }
}
`;
