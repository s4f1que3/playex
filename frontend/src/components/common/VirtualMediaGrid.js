// Virtual Scrolling Component for Long Lists
import React, { useRef, useEffect, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import MediaCard from '../common/MediaCard';
import { getMobileOverscan } from '../../utils/mobileOptimizations';

const VirtualMediaGrid = ({ 
  items = [], 
  columns = 4,
  gap = 16,
  estimateSize = 300,
  overscan 
}) => {
  const parentRef = useRef(null);
  const parentOffsetRef = useRef(0);
  
  // Use mobile-optimized overscan if not provided
  const effectiveOverscan = overscan ?? getMobileOverscan();

  useEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  // Calculate rows based on columns
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < items.length; i += columns) {
      result.push(items.slice(i, i + columns));
    }
    return result;
  }, [items, columns]);

  // Create virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: effectiveOverscan,
  });

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No content available
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="w-full overflow-auto"
      style={{
        height: '100%',
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: `${gap}px`,
                }}
              >
                {row?.map((item, colIndex) => (
                  <div key={item?.id || `${virtualRow.index}-${colIndex}`}>
                    <MediaCard 
                      media={item} 
                      showType={true}
                      priority={virtualRow.index === 0 && colIndex < 2}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(VirtualMediaGrid, (prevProps, nextProps) => {
  return prevProps.items?.length === nextProps.items?.length &&
         prevProps.columns === nextProps.columns &&
         prevProps.gap === nextProps.gap;
});
