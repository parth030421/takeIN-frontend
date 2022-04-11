const showModal = ({id, modalProps = {}}) => {
  return dispatch => {
    dispatch({
      type: 'MODAL__SET_ID',
      payload: id,
    });

    dispatch({
      type: 'MODAL__SET_MODAL_PROPS',
      payload: modalProps,
    });
  };
};

const hideModal = () => {
  return dispatch => {
    dispatch({
      type: 'MODAL__SET_ID',
      payload: '',
    });

    dispatch({
      type: 'MODAL__SET_MODAL_PROPS',
      payload: {},
    });
  };
};

export const ModalActions = {
  showModal,
  hideModal,
};
