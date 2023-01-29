import './Header.css'

export function Header(props) {
    const { addPanel, sidebarToggle } = props;

    const handleAddPanel = event => {
        event.preventDefault();
        addPanel();
    }

    const handleSidebarToggle = event => {
        event.preventDefault();
        sidebarToggle();
    }

    return (
        <div id='Header'>
            <div id='SidePanelToggle' onClick={handleSidebarToggle}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div id='NewPanelButton' onClick={handleAddPanel}>+</div>
        </div>
    )
}