const sortMap = (map) => {
    return new Map(
        [...map].sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
}

export {sortMap}