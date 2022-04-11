import * as React from 'react';
import {Modal, Button, View} from 'react-native';
import {connect} from 'react-redux';
import Error from './Error';
import Success from './Success';

// import our new actions
import {ModalActions} from '../store/modules/Modal/ModalActions';

const Modals = {
  Error: Error,
  Success: Success,
};

export class RootModal extends React.Component {
  render() {
    const {id, modalProps, hideModal} = this.props;

    // assign a constant that is either one of our custom views or a noop function if the id is not set
    const ModalView = Modals[id] || function() {};

    return (
      // show the Modal if the id is set to a truthy value
      <Modal visible={Boolean(id)} animationType="fade" testID="modal">
        <View
          style={{
            flex: 1,
            padding: 20,
            justifyContent: 'space-between',
          }}>
          {/* inject the custom view */}
          <ModalView {...modalProps} />
          <Button onPress={hideModal} title="Close" color="blue" />
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    id: state.modal.id,
    modalProps: state.modal.modalProps,
  };
};

// add hideModal action to props
const mapDispatchToProps = {
  hideModal: ModalActions.hideModal,
};

const ConnectedRootModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RootModal);

export default ConnectedRootModal;
