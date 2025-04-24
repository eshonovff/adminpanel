import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOtzivi,
  GetOtzivi,
  EditOtzivi,
  getVideoReview,
  DeleteVideoReview,
  postVideoReview,
} from "../../Api/Otziviapi";
import { Card, Button, Avatar, Modal, Input, Checkbox, Rate, message, Spin, Tag, Tooltip } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StarOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const Otzivi = () => {
  const dispatch = useDispatch();
  const { data: reviews, videoReview, loading } = useSelector(
    (state) => state.OtziviSlicer
  );

  useEffect(() => {
    dispatch(GetOtzivi());
    dispatch(getVideoReview());
  }, [dispatch]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editedTextRu, setEditedTextRu] = useState("");
  const [editedTextTj, setEditedTextTj] = useState("");
  const [editedTextEn, setEditedTextEn] = useState("");
  const [approved, setApproved] = useState(false);
  const [text, setText] = useState(true);
  const [video, setVideo] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showModal = (review) => {
    setSelectedReview(review);
    setEditedTextRu(review.textRu || "");
    setEditedTextTj(review.text || "");
    setEditedTextEn(review.textEn || "");
    setApproved(review.approved || false);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (selectedReview) {
      const updatedReview = {
        id: selectedReview.id,
        textTj: editedTextTj,
        textRu: editedTextRu,
        textEn: editedTextEn,
        grade: selectedReview.grade,
        approved,
      };
      dispatch(EditOtzivi(updatedReview));
      message.success("Отзыв успешно обновлен");
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const videoRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(null);

  const handlePlay = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current.forEach((video, i) => {
        if (video && i !== index) {
          video.pause();
        }
      });
      videoRefs.current[index].play();
      setIsPlaying(index);
    }
  };

  const [addVideoModal, setAddVideoModal] = useState(false);
  const handleAddVideo = () => {
    setAddVideoModal(true);
  };
  const [reviewerNameTj, setReviewerNameTj] = useState("");
  const [reviewerNameRu, setReviewerNameRu] = useState("");
  const [reviewerNameEn, setReviewerNameEn] = useState("");
  const [videoReviewFile, setVideoReviewFile] = useState("");
  const [previewVideo, setPreviewVideo] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoReviewFile(file);
      const url = URL.createObjectURL(file);
      setPreviewVideo(url);
    }
  };

  const handleOkAddVideoModal = async () => {
    if (!videoReviewFile) {
      message.error("Пожалуйста, загрузите видео");
      return;
    }
    
    if (!reviewerNameRu || !reviewerNameTj || !reviewerNameEn) {
      message.error("Пожалуйста, заполните имя на всех языках");
      return;
    }
    
    setAddVideoModal(false);
    
    const formData = new FormData();
    formData.append("ReviewerNameTj", reviewerNameTj);
    formData.append("ReviewerNameRu", reviewerNameRu);
    formData.append("ReviewerNameEn", reviewerNameEn);
    formData.append("VideoReviewFile", videoReviewFile);
    
    dispatch(postVideoReview(formData));
    message.success("Видео отзыв успешно добавлен");
    
    // Reset form
    setReviewerNameTj("");
    setReviewerNameRu("");
    setReviewerNameEn("");
    setVideoReviewFile("");
    setPreviewVideo("");
  };
  
  const handleCancelVideoModal = () => {
    setAddVideoModal(false);
    setPreviewVideo("");
  };

  const handleDeleteReview = (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteReview = (id, type) => {
    if (type === 'text') {
      dispatch(DeleteOtzivi(id));
    } else {
      dispatch(DeleteVideoReview(id));
    }
    message.success("Отзыв успешно удален");
    setConfirmDelete(null);
  };

  const cancelDeleteReview = () => {
    setConfirmDelete(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Отзывы пользователей</h2>
          <p className="text-lg text-gray-600">Управление и модерация отзывов о нашей платформе</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button
              type={text ? "primary" : "default"}
              icon={<MessageOutlined />}
              size="large"
              className={text ? "bg-blue-600" : ""}
              onClick={() => {
                setText(true);
                setVideo(false);
              }}
            >
              Текстовые отзывы
            </Button>

            <Button
              type={video ? "primary" : "default"}
              icon={<VideoCameraOutlined />}
              size="large"
              className={video ? "bg-blue-600" : ""}
              onClick={() => {
                setVideo(true);
                setText(false);
              }}
            >
              Видео отзывы
            </Button>
            
            {video && (
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddVideo}
                size="large"
                className="bg-green-600 hover:bg-green-700"
              >
                Добавить видео отзыв
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {text && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews && reviews.length > 0 ? (
                      reviews.map((review) => (
                        <Card
                          key={review.id}
                          className="rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-200"
                          title={
                            <div className="flex items-center gap-3">
                              <Avatar
                                size={48}
                                icon={<UserOutlined />}
                                src={review.profileImagePath || undefined}
                                className="border-2 border-blue-500"
                              />
                              <div>
                                <div className="text-lg font-bold">{review.fullName}</div>
                                <div className="flex items-center">
                                  <Rate disabled defaultValue={review.grade} className="text-sm scale-75 origin-left" />
                                  <span className="text-gray-500 text-sm ml-1">({review.grade})</span>
                                </div>
                              </div>
                            </div>
                          }
                          extra={
                            <Tooltip title={review.approved ? "Одобрен" : "Ожидает одобрения"}>
                              {review.approved ? (
                                <Tag color="success" icon={<CheckCircleOutlined />}>Одобрен</Tag>
                              ) : (
                                <Tag color="warning" icon={<CloseCircleOutlined />} className="animate-pulse">Ожидает</Tag>
                              )}
                            </Tooltip>
                          }
                          actions={[
                            <Tooltip title="Редактировать">
                              <Button type="text" icon={<EditOutlined className="text-blue-600" />} onClick={() => showModal(review)} />
                            </Tooltip>,
                            <Tooltip title="Удалить">
                              <Button type="text" icon={<DeleteOutlined className="text-red-600" />} onClick={() => handleDeleteReview(review.id)} />
                            </Tooltip>,
                            <Tooltip title={review.approved ? "Отзыв одобрен" : "Одобрить отзыв"}>
                              <Button 
                                type="text" 
                                icon={review.approved ? <EyeOutlined className="text-green-600" /> : <EyeInvisibleOutlined className="text-orange-500" />} 
                                onClick={() => {
                                  const updatedReview = {
                                    ...review,
                                    approved: !review.approved
                                  };
                                  dispatch(EditOtzivi(updatedReview));
                                }}
                              />
                            </Tooltip>
                          ]}
                        >
                          <div className="h-32 overflow-auto mb-2 p-2 bg-gray-50 rounded-lg">
                            <p className="whitespace-pre-line text-gray-700">{review.text}</p>
                          </div>
                          
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>ID: {review.id}</span>
                            <span>{new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-20">
                        <MessageOutlined className="text-5xl text-gray-300 mb-3" />
                        <p className="text-gray-500 text-lg">Отзывов пока нет</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {video && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {videoReview && videoReview.length > 0 ? (
                      videoReview.map((review, index) => (
                        <div
                          key={review.id}
                          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="relative aspect-video bg-gray-900">
                            <video
                              ref={(el) => (videoRefs.current[index] = el)}
                              className="w-full h-full object-cover"
                              onEnded={() => setIsPlaying(null)}
                            >
                              <source
                                src={
                                  import.meta.env.VITE_APP_API_URL_IMAGE +
                                  review.videoReviewFile
                                }
                                type="video/mp4"
                              />
                              Ваш браузер не поддерживает видео.
                            </video>
                            {isPlaying !== index && (
                              <button
                                onClick={() => handlePlay(index)}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/40 transition-all"
                              >
                                <PlayCircleOutlined className="text-white text-5xl opacity-90 hover:opacity-100 hover:scale-110 transition-all" />
                              </button>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-semibold text-gray-800 truncate">{review.reviewerName}</h3>
                              <Tooltip title="Удалить видео">
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteReview({ id: review.id, type: 'video' })}
                                  size="small"
                                />
                              </Tooltip>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-500">
                              <span>ID: {review.id}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-5 text-center py-20">
                        <VideoCameraOutlined className="text-5xl text-gray-300 mb-3" />
                        <p className="text-gray-500 text-lg">Видео отзывов пока нет</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Review Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-blue-500" />
            <span>Редактирование отзыва</span>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
        width={700}
        okButtonProps={{ className: "bg-blue-600" }}
      >
        <div className="p-2">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Русский</label>
            <Input.TextArea
              value={editedTextRu}
              onChange={(e) => setEditedTextRu(e.target.value)}
              rows={4}
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Текст отзыва на русском"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Тоҷикӣ</label>
            <Input.TextArea
              value={editedTextTj}
              onChange={(e) => setEditedTextTj(e.target.value)}
              rows={4}
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Матни тақриз бо забони тоҷикӣ"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
            <Input.TextArea
              value={editedTextEn}
              onChange={(e) => setEditedTextEn(e.target.value)}
              rows={4}
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Review text in English"
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <StarOutlined className="text-yellow-500 mr-2" />
              <span className="font-medium">Оценка: </span>
              <span className="ml-2">{selectedReview?.grade} / 5</span>
            </div>
            
            <div className="flex items-center">
              <Checkbox
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
                className="mr-2"
              />
              <label className="flex items-center cursor-pointer">
                <span className="mr-2">Статус отзыва:</span>
                {approved ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>Одобрен</Tag>
                ) : (
                  <Tag color="warning" icon={<CloseCircleOutlined />}>Ожидает одобрения</Tag>
                )}
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Video Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <VideoCameraOutlined className="text-green-500" />
            <span>Добавление видео отзыва</span>
          </div>
        }
        open={addVideoModal}
        onOk={handleOkAddVideoModal}
        onCancel={handleCancelVideoModal}
        okText="Добавить"
        cancelText="Отмена"
        width={700}
        okButtonProps={{ className: "bg-green-600" }}
      >
        <div className="p-2">
          {/* Video preview */}
          {previewVideo ? (
            <div className="mb-4 border rounded-lg overflow-hidden bg-gray-900">
              <video 
                className="w-full h-48 object-cover" 
                src={previewVideo} 
                controls
              />
              <div className="p-2 bg-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500 truncate">
                  {videoReviewFile.name}
                </span>
                <Button 
                  type="text" 
                  icon={<DeleteOutlined className="text-red-500" />} 
                  onClick={() => {
                    setVideoReviewFile("");
                    setPreviewVideo("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div 
              className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              <UploadOutlined className="text-4xl text-gray-400 mb-2" />
              <p className="text-gray-600">Нажмите для загрузки видео или перетащите файл сюда</p>
              <p className="text-xs text-gray-500 mt-1">Поддерживаемые форматы: MP4, WebM, Ogg</p>
            </div>
          )}
          
          <input 
            ref={fileInputRef}
            type="file" 
            accept="video/mp4,video/webm,video/ogg" 
            className="hidden"
            onChange={handleFileChange}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
              <Input
                value={reviewerNameEn}
                onChange={(e) => setReviewerNameEn(e.target.value)}
                placeholder="Enter name in English"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя (Русский)</label>
              <Input
                value={reviewerNameRu}
                onChange={(e) => setReviewerNameRu(e.target.value)}
                placeholder="Введите имя на русском"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ном (Тоҷикӣ)</label>
              <Input
                value={reviewerNameTj}
                onChange={(e) => setReviewerNameTj(e.target.value)}
                placeholder="Номро бо тоҷикӣ ворид кунед"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
            <p>Убедитесь, что загружаемое видео соответствует нашим требованиям:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Хорошее качество изображения и звука</li>
              <li>Продолжительность не более 2 минут</li>
              <li>Содержит только конструктивные комментарии о нашей платформе</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <DeleteOutlined />
            <span>Подтверждение удаления</span>
          </div>
        }
        open={confirmDelete !== null}
        onOk={() => confirmDeleteReview(
          typeof confirmDelete === 'object' ? confirmDelete.id : confirmDelete,
          typeof confirmDelete === 'object' ? confirmDelete.type : 'text'
        )}
        onCancel={cancelDeleteReview}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
      >
        <p>Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
};

export default Otzivi;