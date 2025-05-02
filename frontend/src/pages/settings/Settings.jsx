import "./Settings.scss";

const Settings = () => {
    return (
        <div className="settings-container">
            <div className="settings-tabs">
                <button className="tab active">General Settings</button>
                <button className="tab">Security Settings</button>
                <button className="tab">Theme Settings</button>
                <button className="tab">Change Password</button>
            </div>

            <div className="settings-card">
                <h3 className="section-title">Basic Details</h3>
                <form>
                    <div className="form">
                        <label className="companyName">Company Name - </label>
                        <input type="text" id="companyName" placeholder="Enter company name" />
                    </div>

                    <div className="file-group">
                        <div className="form-file">
                            <label htmlFor="logo">Logo - </label>
                            <div className="file-upload">
                                <input type="file" id="logo" />
                                <div className="file-placeholder">
                                    <span>Recommended image size is 150px x 150px</span>
                                    <div className="file-preview"></div>
                                </div>
                            </div>
                        </div>
                        <div className="form-file">
                            <label htmlFor="favicon">Favicon - </label>
                            <div className="file-upload">
                                <input type="file" id="favicon" />
                                <div className="file-placeholder">
                                    <span>
                                        Recommended image size is 16px x 16px or 32px x 32px<br />
                                        Accepted formats: only png and ico
                                    </span>
                                    <div className="file-preview"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button type="submit" className="update-button">Update</button>
                        <button type="button" className="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
