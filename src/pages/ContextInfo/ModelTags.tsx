import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

type Model = {
  title: string;
  isShow?: boolean;
  showModal: (flag: boolean) => void;
};

const ModelTags: React.FC<Model> = ({ title, isShow = false, showModal }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setIsModalVisible(isShow);
  }, [isShow]);

  const handleOk = () => {
    setIsModalVisible(false);
    showModal(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    showModal(false);
  };
  return (
    <div>
      <Modal title={title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>文章详细信息</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default ModelTags;
