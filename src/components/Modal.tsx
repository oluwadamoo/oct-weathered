import Button from "./Button";

interface IModal {
    text?: string;
    onAccept: () => void;
    onReject: () => void;
}
export function Modal({ text, onAccept, onReject }: IModal) {
    return (
        <div className="modal-container">
            <div className='modal'>
                <div className='modal-body'>
                    {text ? text : 'Would you like to see the weather details of your city?'}
                </div>

                <div className='modal-footer'>
                    <Button label={'Later'} onClick={onReject} />
                    <Button label={'Yes'} onClick={onAccept} />
                </div>
            </div>
        </div>
    )
}