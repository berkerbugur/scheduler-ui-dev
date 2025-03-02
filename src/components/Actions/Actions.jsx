import './Actions.css';

const Actions = ({reset, autoComp, upload, canReset, canAutoComp, canUpload, hover}) => {
    return (
        <div className="actions">
            <button className={`btn ${canReset ? 'active-b pointer' : 'disabled-b'}`} disabled={!canReset} onClick={reset}>Reset</button>
            <button className={`btn ${canAutoComp ? 'active-p pointer' : 'disabled-p'}`} disabled={!canAutoComp} onClick={autoComp} onMouseEnter={() => canAutoComp && hover(true)} onMouseLeave={() => canAutoComp && hover(false)}>Autocomplete</button>
            <button className={`btn ${canUpload ? 'active-b pointer' : 'disabled-b'}`} disabled={!canUpload} onClick={upload}>Upload</button>
        </div>
    );
};

export default Actions; 