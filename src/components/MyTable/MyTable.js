import { useSelector } from "react-redux";
import style from "./MyTable.module.css";
import React from "react";
import { useTable, usePagination, useSortBy } from "react-table"

function MyTable() {

    const allColumns = useSelector(state => state.loadedKeys) ;
    const allData = useSelector(state => state.loadedTable);

    const data = React.useMemo(
        () => allData,
        [allData]
    )
    const columns = React.useMemo(
        () => allColumns,
        [allColumns]
    )

    let hiddenColumns; 

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
        setHiddenColumns,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, hiddenColumns: columns.filter(column => !column.show).map(column => column.id) },
        },
        useSortBy,
        usePagination,
    )

    React.useEffect(
        () => {
            hiddenColumns = [];
            for (let col of columns) {
                if (col.show === false) {
                    hiddenColumns.push(col.id);
                }
            }
          setHiddenColumns(hiddenColumns);
        },
        [columns]
      );

    // Render the UI for your table
    return (
 
        <> { data && columns &&
            < div className={style.tableWrap}>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()} className={style.cells}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        }
            
        </>
    )
}


export default MyTable;