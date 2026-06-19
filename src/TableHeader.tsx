import React, { useRef, useCallback, useImperativeHandle, useReducer } from 'react';
import PropTypes from 'prop-types';

import type { ColumnShape, RowData } from './types';

export interface TableHeaderProps {
  className?: string;
  width: number;
  height: number;
  headerHeight: number | number[];
  rowWidth: number;
  rowHeight: number;
  columns: ColumnShape[];
  data: RowData[];
  frozenData?: RowData[];
  headerRenderer: (args: {
    style: React.CSSProperties;
    columns: ColumnShape[];
    headerIndex: number;
  }) => React.ReactNode;
  rowRenderer: (args: {
    style: React.CSSProperties;
    columns: ColumnShape[];
    rowData: RowData;
    rowIndex: number;
  }) => React.ReactNode;
  hoveredRowKey?: string | number | null;
}

export interface TableHeaderHandle {
  scrollTo: (offset: number) => void;
  forceUpdate: () => void;
}

const InnerTableHeader = React.forwardRef<TableHeaderHandle, TableHeaderProps>(
  (
    {
      className,
      width,
      height,
      headerHeight,
      rowWidth,
      rowHeight,
      columns,
      data,
      frozenData,
      headerRenderer,
      rowRenderer,
    },
    ref,
  ) => {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [, forceRender] = useReducer((x: number) => x + 1, 0);

    useImperativeHandle(ref, () => ({
      scrollTo(offset: number) {
        requestAnimationFrame(() => {
          if (headerRef.current) headerRef.current.scrollLeft = offset;
        });
      },
      forceUpdate() {
        forceRender();
      },
    }));

    const renderHeaderRow = useCallback(
      (rowHeight: number, index: number) => {
        if (rowHeight <= 0) return null;
        const style: React.CSSProperties = { width: '100%', height: rowHeight };
        return headerRenderer({ style, columns, headerIndex: index });
      },
      [columns, headerRenderer],
    );

    const renderFrozenRow = useCallback(
      (rowData: RowData, index: number) => {
        const style: React.CSSProperties = { width: '100%', height: rowHeight };
        const rowIndex = -index - 1;
        return rowRenderer({ style, columns, rowData, rowIndex });
      },
      [columns, rowHeight, rowRenderer],
    );

    if (height <= 0) return null;

    const style: React.CSSProperties = {
      width,
      height: height,
      position: 'relative',
      overflow: 'hidden',
    };

    const innerStyle: React.CSSProperties = {
      width: rowWidth,
      height,
    };

    const rowHeights = Array.isArray(headerHeight) ? headerHeight : [headerHeight];
    return (
      <div role="grid" ref={headerRef} className={className} style={style}>
        <div role="rowgroup" style={innerStyle}>
          {rowHeights.map(renderHeaderRow)}
          {frozenData && frozenData.map(renderFrozenRow)}
        </div>
      </div>
    );
  },
);

InnerTableHeader.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  rowWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.array.isRequired,
  frozenData: PropTypes.array,
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
};

const TableHeader = React.memo(InnerTableHeader);

export default TableHeader;
