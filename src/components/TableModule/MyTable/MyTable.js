import { useSelector, useDispatch } from "react-redux";
import style from "./MyTable.module.css";
import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";


function MyTable() {

    const allColumns = useSelector(state => state.loadedKeys);
    const allData = useSelector(state => state.loadedTable);
    

    const [columns, setColumns] = React.useState([]);
    const [data, setData] = React.useState([]);

    const dispatch = useDispatch();

    


    React.useEffect(() => {
        setData(allData);
    }, [allData])

    React.useEffect(() => {
        setColumns(allColumns)
    }, [allColumns])

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
            autoResetPage: false
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


    // questo timeout serve per evitare un bug che non sono riuscito ad evitare altrimenti,
    // senza questo, al refresh della pagina la tabella non riesce a reperire le props delle colonne per tempo e da errore
    const [canRenderCol, setCanRenderCol] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setCanRenderCol(true)
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Render the UI for your table
    return (

        <>
            < div className={style.tableWrap}>

                <table {...getTableProps()}>

                    <thead>
                        {canRenderCol && headerGroups.map(headerGroup => {
                            return (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => {
                                        return (
                                            <th className={column.added ? "addedCol" : undefined} {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}</th>
                                        )
                                    })}
                                </tr>
                            )
                        })}
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

                <div className={style.pagination}>
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
                    <div className={"customSelect"}>
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

            </div>
        </>
    )

}


export default MyTable;