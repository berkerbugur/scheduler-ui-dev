import './Actions.css';

const Actions = ({reset, autoComp, upload, canReset, canAutoComp, canUpload, addTemplate, removeTemplate, validationErr}) => {
    return (
        <div className="footer">
            <span className={`validation ${validationErr ? '' : 'invisible'}`}>Day slots should be in ascending order.</span>
            <div className="actions">
                <button className={`btn ${canReset ? 'active-b pointer' : 'disabled-b'}`} disabled={!canReset}
                        onClick={reset}>Reset
                </button>
                <button className={`btn ${canAutoComp ? 'active-p pointer' : 'disabled-p'}`} disabled={!canAutoComp}
                        onClick={autoComp} onMouseEnter={() => canAutoComp && addTemplate()}
                        onMouseLeave={() => canAutoComp && removeTemplate()}>Autocomplete
                </button>
                <button className={`btn ${!canUpload || validationErr ? 'disabled-b' : 'active-b pointer '}`} disabled={!canUpload || validationErr}
                        onClick={upload}>Upload
                </button>
            </div>
        </div>
    );
};

export default Actions; 