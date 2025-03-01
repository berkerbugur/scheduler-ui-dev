import './ScrollBar.css';
import {useMemo} from "react";

const ScrollBar = ({pageCount, currentPage}) => {
    const style = useMemo(() => {
        return {
            width: (100 / pageCount) + '%',
            left: (100 / pageCount * currentPage) + '%',
        }
    }, [pageCount, currentPage]);

    return (
        <div className={`scrollbar-container ${!pageCount && 'invisible'}`}>
            <div className={`scrollbar`} style={style}></div>
        </div>
    )
}

export default ScrollBar;