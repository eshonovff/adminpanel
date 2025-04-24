// Компонент управления галереей для админ-панели
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Spin,
  Button,
  Modal,
  Upload,
  message,
  Divider,
  Popconfirm,
  Empty,
  List,
  ConfigProvider
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
  UploadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { GetGallery, PostGallery, DeleteGallery } from '../Api/GalleryApi';
import { useMediaQuery } from 'react-responsive';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const Gallery = () => {
  const dispatch = useDispatch();
  const { gallery, loading } = useSelector((state) => state.GallerySlicer);
  
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  
  // Media queries для адаптивности
  const isMobile = useMediaQuery({ maxWidth: 767 });


  // Загрузка данных при первом рендеринге
  useEffect(() => {
    loadAllData();
  }, [dispatch]);

  // Функция для загрузки всех данных
  const loadAllData = () => {
    dispatch(GetGallery());
  };

  // Проверка типа медиафайла
  const isVideoFile = (url) => {
    return url && (url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.avi') || url.endsWith('.webm'));
  };

  // Обработка загрузки файла
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Добавление нового медиафайла
  const handleUpload = () => {
    if (fileList.length === 0) {
      message.error("Пожалуйста, выберите файл для загрузки");
      return;
    }

    const formData = new FormData();
    formData.append("MediaFile", fileList[0].originFileObj);

    // Консоль лог для проверки
    console.log("Sending data to API:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    dispatch(PostGallery(formData))
      .then(() => {
        message.success("Медиафайл успешно загружен!");
        setFileList([]);
        setUploadModal(false);
        loadAllData();
      })
      .catch(error => {
        console.error("POST error details:", error);
        message.error("Ошибка при загрузке: " + (error.message || "Неизвестная ошибка"));
      });
  };

  // Удаление медиафайла
  const handleDelete = (id) => {
    dispatch(DeleteGallery(id))
      .then(() => {
        message.success("Медиафайл успешно удален!");
        loadAllData();
      })
      .catch(error => {
        message.error("Ошибка при удалении: " + error.message);
      });
  };

  // Предпросмотр медиафайла
  const handlePreview = (item) => {
    setPreviewItem(item);
    setPreviewVisible(true);
  };

  // Рендер галереи
  const renderGalleryItems = () => {
    if (!Array.isArray(gallery) || gallery.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Нет загруженных медиафайлов"
          style={{ margin: '40px 0' }}
        >
          <Button 
            type="primary" 
            icon={<UploadOutlined />} 
            onClick={() => setUploadModal(true)}
          >
            Загрузить первый медиафайл
          </Button>
        </Empty>
      );
    }

    return (
      <List
        grid={{ 
          gutter: 16, 
          xs: 1, 
          sm: 2, 
          md: 3, 
          lg: 4, 
          xl: 4, 
          xxl: 6 
        }}
        dataSource={gallery}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              cover={
                <div 
                  style={{ 
                    height: 200, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#f5f5f5'
                  }}
                >
                  {isVideoFile(item.mediaUrl) ? (
                    <div 
                      style={{ 
                        position: 'relative', 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: '#000'
                      }}
                    >
                      <video 
                        src={import.meta.env.VITE_APP_API_URL_IMAGE + item.mediaUrl}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        preload="metadata"
                      />
                      <PlayCircleOutlined 
                        style={{ 
                          position: 'absolute', 
                          fontSize: 48, 
                          color: 'white', 
                          opacity: 0.8 
                        }} 
                      />
                    </div>
                  ) : (
                    <img 
                      alt="gallery item"
                      src={import.meta.env.VITE_APP_API_URL_IMAGE + item.mediaUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      background: 'rgba(0,0,0,0.4)', 
                      opacity: 0, 
                      transition: 'all 0.3s',
                      ':hover': { opacity: 1 }
                    }}
                    className="hover:opacity-100"
                  >
                    <Button 
                      type="primary" 
                      icon={<EyeOutlined />} 
                      style={{ margin: 5 }}
                      onClick={() => handlePreview(item)}
                    >
                      Просмотр
                    </Button>
                  </div>
                </div>
              }
              actions={[
                <Popconfirm
                  title="Вы уверены, что хотите удалить этот файл?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Да"
                  cancelText="Нет"
                  icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                >
                  <Button danger icon={<DeleteOutlined />}>Удалить</Button>
                </Popconfirm>,
                <Button 
                  icon={<EyeOutlined />} 
                  onClick={() => handlePreview(item)}
                >
                  Просмотр
                </Button>
              ]}
            >
              <Card.Meta
                title={isVideoFile(item.mediaUrl) ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <VideoCameraOutlined style={{ marginRight: 8 }} /> Видео
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FileImageOutlined style={{ marginRight: 8 }} /> Изображение
                  </div>
                )}
                description={
                  <Text ellipsis style={{ width: '100%' }}>
                    {item.mediaUrl.split('/').pop()}
                  </Text>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        }
      }}
    >
      <div className="p-2 sm:p-4 md:p-6">
        <Card className="shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
            <div className="mb-3 sm:mb-0">
              <Title level={isMobile ? 5 : 4} className="m-0">Управление галереей</Title>
              <Text type="secondary">Загрузка и управление медиафайлами</Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setUploadModal(true)}
              size={isMobile ? "middle" : "large"}
            >
              {isMobile ? "Загрузить" : "Загрузить файл"}
            </Button>
          </div>

          <Divider className="my-2 sm:my-3" />

          {loading ? (
            <div className="flex justify-center items-center py-10 sm:py-20">
              <Spin size={isMobile ? "default" : "large"} />
            </div>
          ) : (
            <div className="gallery-container">
              {renderGalleryItems()}
            </div>
          )}
        </Card>

        {/* Модальное окно для загрузки файла */}
        <Modal
          title="Загрузка медиафайла"
          open={uploadModal}
          onOk={handleUpload}
          onCancel={() => {
            setUploadModal(false);
            setFileList([]);
          }}
          okText="Загрузить"
          cancelText="Отмена"
          width={isMobile ? "100%" : 520}
        >
          <Dragger
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            maxCount={1}
            multiple={false}
            accept="image/*,video/*"
            style={{ marginTop: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">Нажмите или перетащите файл в эту область</p>
            <p className="ant-upload-hint">
              Поддерживаются изображения (JPG, PNG, GIF) и видео (MP4, MOV)
            </p>
          </Dragger>
        </Modal>

        {/* Модальное окно для предпросмотра */}
        <Modal
          title={previewItem && isVideoFile(previewItem.mediaUrl) ? "Просмотр видео" : "Просмотр изображения"}
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width={isMobile ? "100%" : "80%"}
          style={{ maxWidth: 1000 }}
          centered
        >
          {previewItem && (
            isVideoFile(previewItem.mediaUrl) ? (
              <video 
                src={import.meta.env.VITE_APP_API_URL_IMAGE + previewItem.mediaUrl}
                style={{ width: '100%', maxHeight: '70vh' }}
                controls
                autoPlay
              />
            ) : (
              <img 
                alt="preview"
                src={import.meta.env.VITE_APP_API_URL_IMAGE + previewItem.mediaUrl}
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            )
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Gallery;