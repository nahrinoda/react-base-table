import React from 'react';
import PropTypes from 'prop-types';

import type { TableHeaderCellProps } from './types';

/**
 * HeaderCell component for BaseTable
 */
const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ className, column, columnIndex }) => (
  <div className={className}>{column?.title}</div>
);

TableHeaderCell.propTypes = {
  className: PropTypes.string,
  column: PropTypes.object,
  columnIndex: PropTypes.number,
};

export default TableHeaderCell;
