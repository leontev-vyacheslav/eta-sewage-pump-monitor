import Button from 'devextreme-react/button';
import './round-button.scss'; // Create this CSS file

function RoundButton() {
    return (
        <Button
            icon="+"
            type="default"
            stylingMode="contained"
            className="round-button"
            onClick={ () => console.log('Round button clicked') }
        />
    );
}

export default RoundButton;