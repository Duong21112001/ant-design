import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import omit from 'rc-util/lib/omit';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import useStyle from './style';
import { getFixedBottom, getFixedTop, getTargetRect } from './utils';

const TRIGGER_EVENTS = [
  'resize',
  'scroll',
  'touchstart',
  'touchmove',
  'touchend',
  'pageshow',
  'load',
] as const;

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}

// Affix
export interface AffixProps {
  /** Triggered when the specified offset is reached from the top of the window */
  offsetTop?: number;
  /** Triggered when the specified offset is reached from the bottom of the window */
  offsetBottom?: number;
  style?: React.CSSProperties;
  /** Callback function triggered when fixed state changes */
  onChange?: (affixed?: boolean) => void;
  /** Set the element that Affix needs to listen to its scroll event, the value is a function that returns the corresponding DOM element */
  target?: () => Window | HTMLElement | null;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  children: React.ReactNode;
}

enum AffixStatus {
  None,
  Prepare,
}

export interface AffixState {
  affixStyle?: React.CSSProperties;
  placeholderStyle?: React.CSSProperties;
  status: AffixStatus;
  lastAffix: boolean;
  prevTarget: Window | HTMLElement | null;
}

const Affix: React.FC<AffixProps> = (props) => {
  const {
    rootClassName: customizeRootClassName,
    children,
    offsetBottom,
    offsetTop,
    prefixCls: customizePrefixCls,
    onChange,
    target: customizeTarget,
  } = props;

  const [lastAffix, setLastAffix] = useState<boolean>(false);
  const [affixStyle, setAffixStyle] = useState<React.CSSProperties>();
  const [placeholderStyle, setPlaceholderStyle] = useState<React.CSSProperties>();
  const placeholderNodeRef = useRef<HTMLDivElement>(null);
  const fixedNodeRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { getTargetContainer, getPrefixCls } = useContext<ConfigConsumerProps>(ConfigContext);

  const affixPrefixCls = getPrefixCls('affix', customizePrefixCls);

  const target = useMemo<ReturnType<NonNullable<AffixProps['target']>>>(
    () => (customizeTarget ?? getTargetContainer ?? getDefaultTarget)(),
    [customizeTarget, getTargetContainer],
  );

  const memoOffsetTop = useMemo<number>(
    () => (offsetBottom === undefined && offsetTop === undefined ? 0 : (offsetTop as number)),
    [offsetBottom, offsetTop],
  );

  const measure = () => {
    if (!target || !fixedNodeRef.current || !placeholderNodeRef.current) {
      return;
    }
    const placeholderRect = getTargetRect(placeholderNodeRef.current);
    if (
      placeholderRect.top === 0 &&
      placeholderRect.left === 0 &&
      placeholderRect.width === 0 &&
      placeholderRect.height === 0
    ) {
      return;
    }

    const targetRect = getTargetRect(target);
    const fixedTop = getFixedTop(placeholderRect, targetRect, memoOffsetTop);
    const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom);

    if (fixedTop !== undefined) {
      setAffixStyle({
        position: 'fixed',
        top: fixedTop,
        width: placeholderRect.width,
        height: placeholderRect.height,
      });
      setPlaceholderStyle({
        width: placeholderRect.width,
        height: placeholderRect.height,
      });
    } else if (fixedBottom !== undefined) {
      setAffixStyle({
        position: 'fixed',
        bottom: fixedBottom,
        width: placeholderRect.width,
        height: placeholderRect.height,
      });
      setPlaceholderStyle({
        width: placeholderRect.width,
        height: placeholderRect.height,
      });
    }
    setLastAffix((prevState) => {
      if (lastAffix !== prevState) {
        onChange?.(!!affixStyle);
        return !!affixStyle;
      }
      return lastAffix;
    });
  };

  const lazyUpdatePosition = throttleByAnimationFrame(() => {
    // Check position change before measure to make Safari smooth

    if (target && placeholderNodeRef.current) {
      const targetRect = getTargetRect(target);
      const placeholderRect = getTargetRect(placeholderNodeRef.current);
      const fixedTop = getFixedTop(placeholderRect, targetRect, memoOffsetTop);
      const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom);
      if (
        (fixedTop !== undefined && affixStyle?.top === fixedTop) ||
        (fixedBottom !== undefined && affixStyle?.bottom === fixedBottom)
      ) {
        return;
      }
    }
    measure();
  });

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      TRIGGER_EVENTS.forEach((eventName) => {
        target?.addEventListener(eventName, lazyUpdatePosition);
      });
      measure();
    });
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      TRIGGER_EVENTS.forEach((eventName) => {
        target?.removeEventListener(eventName, lazyUpdatePosition);
      });

      lazyUpdatePosition.cancel();
    };
  }, [offsetTop, offsetBottom, customizeTarget, getTargetContainer]);
  const [wrapSSR, hashId] = useStyle(affixPrefixCls);
  const rootClassName = classNames(customizeRootClassName, hashId);

  const className = classNames(affixStyle && rootClassName, {
    [affixPrefixCls]: !!affixStyle,
  });

  const divProps = omit(props, [
    'prefixCls',
    'offsetTop',
    'offsetBottom',
    'target',
    'onChange',
    'rootClassName',
  ]);

  return wrapSSR(
    <ResizeObserver onResize={lazyUpdatePosition}>
      <div {...divProps} ref={placeholderNodeRef}>
        {affixStyle && <div style={placeholderStyle} aria-hidden="true" />}
        <div className={className} ref={fixedNodeRef} style={affixStyle}>
          <ResizeObserver onResize={lazyUpdatePosition}>{children}</ResizeObserver>
        </div>
      </div>
    </ResizeObserver>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Affix.displayName = 'Affix';
}

export default Affix;
