import { useEffect, useState } from "react";
import { Card, Button, Tabs, Badge, Tag, Empty, Spin, notification, Tooltip, Skeleton, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  ApprovedRequest,
  DeleteRequest,
  GetZayavki,
} from "../../Api/zayavkiapi";
import {
  CalendarOutlined,
  DeleteOutlined,
  CheckOutlined,
  MailOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export default function AdminRequests() {
  const dispatch = useDispatch();
  const { data: requests, loading } = useSelector((state) => state.ZayavkiSlicer);
  const [openingCardId, setOpeningCardId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchText, setSearchText] = useState("");

  // Track window width for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Load requests on component mount
  useEffect(() => {
    loadRequests();
  }, [dispatch]);

  const loadRequests = () => {
    dispatch(GetZayavki());
  };

  // Format date to be more user-friendly
  const formatDate = (createdAt) => {
    if (!createdAt) return "Дата не указана";
    
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return "Неверная дата";
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    // Format options
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    
    if (isToday) {
      return `Сегодня, ${date.toLocaleTimeString(undefined, timeOptions)}`;
    } else if (isYesterday) {
      return `Вчера, ${date.toLocaleTimeString(undefined, timeOptions)}`;
    } else {
      return date.toLocaleDateString(undefined, dateOptions) + `, ${date.toLocaleTimeString(undefined, timeOptions)}`;
    }
  };

  // Get formatted date for tab titles
  const getFormattedTabDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера";
    } else {
      return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  // Handle request approval
  const handleApprove = (id) => {
    dispatch(ApprovedRequest(id))
      .then(() => {
        notification.success({
          message: "Успешно",
          description: "Заявка была одобрена",
          placement: "topRight",
        });
      })
      .catch((error) => {
        notification.error({
          message: "Ошибка",
          description: error.message || "Не удалось одобрить заявку",
          placement: "topRight",
        });
      });
  };

  // Handle request deletion
  const handleDelete = (id) => {
    dispatch(DeleteRequest(id))
      .then(() => {
        notification.success({
          message: "Успешно",
          description: "Заявка была удалена",
          placement: "topRight",
        });
      })
      .catch((error) => {
        notification.error({
          message: "Ошибка",
          description: error.message || "Не удалось удалить заявку",
          placement: "topRight",
        });
      });
  };

  // This function is no longer used since we generate a fixed list of days
  // But we keep it here for potential future use
  const filterRequests = (allRequests) => {
    // Apply search filter first
    let filteredRequests = allRequests;
    
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredRequests = allRequests.filter(req => 
        (req.FullName || req.fullName || "").toLowerCase().includes(searchLower) ||
        (req.Email || req.email || "").toLowerCase().includes(searchLower) ||
        (req.Phone || req.phone || "").toLowerCase().includes(searchLower) ||
        (req.Question || req.question || "").toLowerCase().includes(searchLower) ||
        (req.Find || req.find || "").toLowerCase().includes(searchLower)
      );
    }
    
    // Group requests by date
    const groupedRequests = {};
    
    filteredRequests.forEach(req => {
      const date = new Date(req.createdAt);
      const dateString = date.toDateString();
      
      if (!groupedRequests[dateString]) {
        groupedRequests[dateString] = {
          date: date,
          requests: []
        };
      }
      
      groupedRequests[dateString].requests.push(req);
    });
    
    // Sort dates in descending order (newest first)
    return Object.values(groupedRequests).sort((a, b) => b.date - a.date);
  };

  // Status badge for request
  const getStatusBadge = (isApproved) => {
    return isApproved ? (
      <Tag color="success" className="ml-2">Одобрено</Tag>
    ) : (
      <Tag color="processing" className="ml-2">В обработке</Tag>
    );
  };

  // Calculate card width based on screen size
  const getCardWidth = () => {
    if (windowWidth >= 1400) return "calc(33.33% - 20px)"; // 3 cards per row for large screens
    if (windowWidth >= 1100) return "calc(50% - 16px)"; // 2 cards per row for medium screens
    if (windowWidth >= 800) return "calc(50% - 16px)"; // 2 cards per row for small desktop/tablets
    return "100%"; // 1 card per row for mobile
  };

  // Request Card component
  const RequestCard = ({ request, showOpenEffect = false }) => {
    const isOpening = openingCardId === request.id;
    const cardClass = `transition-all duration-300 ${
      showOpenEffect && isOpening ? "scale-102 shadow-2xl" : "hover:shadow-lg"
    } ${request.isApproved ? "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-l-green-500" : "bg-white"}`;

    return (
      <Card
        key={request.id}
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserOutlined className="mr-2 text-blue-500" />
              <span className="font-medium">{request.FullName || request.fullName || "Без имени"}</span>
            </div>
            {getStatusBadge(request.isApproved)}
          </div>
        }
        className={cardClass}
        style={{ width: getCardWidth(), marginBottom: '16px' }}
        loading={loading}
        bordered
        hoverable
        onClick={() => setOpeningCardId(request.id)}
      >
        <div className="space-y-3">
          <div className="flex items-start">
            <MailOutlined className="mr-2 mt-1 text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Эл. почта:</div>
              <div className="break-words">{request.Email || request.email || "Не указано"}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <PhoneOutlined className="mr-2 mt-1 text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Телефон:</div>
              <div>{request.Phone || request.phone || "Не указано"}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <QuestionCircleOutlined className="mr-2 mt-1 text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Сообщение:</div>
              <div className="break-words">{request.Question || request.question || "Не указано"}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <InfoCircleOutlined className="mr-2 mt-1 text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Источник:</div>
              <div>{request.Find || request.find || "Не указано"}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <CalendarOutlined className="mr-2 mt-1 text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Дата создания:</div>
              <div>{formatDate(request.createdAt)}</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4 pt-3 border-t">
          <Tooltip title={request.isApproved ? "Заявка уже одобрена" : "Одобрить заявку"}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(request.id);
              }}
              type="primary"
              icon={<CheckOutlined />}
              disabled={request.isApproved}
            >
              Одобрить
            </Button>
          </Tooltip>
          
          <Tooltip title="Удалить заявку">
            <Button
              danger
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(request.id);
              }}
              icon={<DeleteOutlined />}
            >
              Удалить
            </Button>
          </Tooltip>
        </div>
      </Card>
    );
  };

  // Request list component with loading states
  const RequestList = ({ requests }) => {
    if (loading) {
      return (
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} style={{ width: getCardWidth(), marginBottom: '16px' }}>
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </Card>
          ))}
        </div>
      );
    }

    if (!requests || requests.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Заявок не найдено"
          className="my-12"
        >
          <Button type="primary" onClick={loadRequests} icon={<ReloadOutlined />}>
            Обновить
          </Button>
        </Empty>
      );
    }

    return (
      <div className="flex flex-wrap gap-4 justify-start">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} showOpenEffect />
        ))}
      </div>
    );
  };

  // Generate a list of the last N days, including today
  const generateLastNDays = (n) => {
    const result = [];
    const today = new Date();
    
    for (let i = 0; i < n; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      result.push({
        date: date,
        dateString: date.toDateString(),
        requests: []
      });
    }
    
    return result;
  };
  
  // Group requests by date (for last month view)
  const groupRequestsByDate = (requests) => {
    const grouped = {};
    
    requests.forEach(req => {
      if (!req.createdAt) return;
      
      const date = new Date(req.createdAt);
      if (isNaN(date.getTime())) return;
      
      const dateString = date.toDateString();
      
      if (!grouped[dateString]) {
        grouped[dateString] = {
          date: date,
          dateString: dateString,
          requests: []
        };
      }
      
      grouped[dateString].requests.push(req);
    });
    
    return Object.values(grouped).sort((a, b) => b.date - a.date); // Sort by date (newest first)
  };
  
  // Create a list of the past 7 days
  const lastSevenDays = generateLastNDays(7);
  
  // Filter requests based on search text
  const filteredRequests = requests || [];
  const searchFilteredRequests = searchText 
    ? filteredRequests.filter(req => {
        const searchLower = searchText.toLowerCase();
        return (
          (req.FullName || req.fullName || "").toLowerCase().includes(searchLower) ||
          (req.Email || req.email || "").toLowerCase().includes(searchLower) ||
          (req.Phone || req.phone || "").toLowerCase().includes(searchLower) ||
          (req.Question || req.question || "").toLowerCase().includes(searchLower) ||
          (req.Find || req.find || "").toLowerCase().includes(searchLower)
        );
      })
    : filteredRequests;
  
  // Get requests from the last 30 days
  const lastMonthDate = new Date();
  lastMonthDate.setDate(lastMonthDate.getDate() - 30);
  
  const lastMonthRequests = searchFilteredRequests.filter(req => {
    const reqDate = new Date(req.createdAt);
    return !isNaN(reqDate.getTime()) && reqDate >= lastMonthDate;
  });
  
  // Count total requests in last month
  const totalLastMonthRequests = lastMonthRequests.length;
  
  // Group last month requests by date
  const groupedLastMonthRequests = groupRequestsByDate(lastMonthRequests);
  
  // Add requests to the appropriate day (for 7-day view)
  searchFilteredRequests.forEach(req => {
    const reqDate = new Date(req.createdAt);
    if (isNaN(reqDate.getTime())) return;
    
    const reqDateString = reqDate.toDateString();
    
    const dayGroup = lastSevenDays.find(day => day.dateString === reqDateString);
    if (dayGroup) {
      dayGroup.requests.push(req);
    }
  });
  
  // Tab for last month requests
  const lastMonthTab = {
    key: 'lastMonth',
    label: (
      <span className="flex items-center">
        <Badge count={totalLastMonthRequests} offset={[5, 0]} showZero={false}>
          <span className="mr-2">Последний месяц</span>
        </Badge>
      </span>
    ),
    children: (
      <div>
        {totalLastMonthRequests > 0 ? (
          <div className="space-y-8">
            {groupedLastMonthRequests.map(dayGroup => (
              <div key={dayGroup.dateString} className="border-b pb-6 mb-6 last:border-b-0">
                <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                  <CalendarOutlined className="mr-2" />
                  {getFormattedTabDate(dayGroup.date)} 
                  <Badge count={dayGroup.requests.length} className="ml-2" />
                </h3>
                <RequestList requests={dayGroup.requests} />
              </div>
            ))}
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="За последний месяц заявок не поступало"
            className="my-12"
          />
        )}
      </div>
    ),
  };
  
  // Generate tabs for each day (for 7-day view)
  const dayTabs = lastSevenDays.map((day) => ({
    key: day.dateString,
    label: (
      <span className="flex items-center">
        <Badge count={day.requests.length} offset={[5, 0]} showZero={false}>
          <span className="mr-2">{getFormattedTabDate(day.date)}</span>
        </Badge>
      </span>
    ),
    children: day.requests.length > 0 
      ? <RequestList requests={day.requests} />
      : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`${getFormattedTabDate(day.date) === "Сегодня" ? "Сегодня" : getFormattedTabDate(day.date)} заявок не поступало`}
          className="my-12"
        />
      ),
  }));
  
  // Combine last month tab with day tabs
  const tabItems = [lastMonthTab, ...dayTabs];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Заявки</h2>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
          <Input
            placeholder="Поиск заявок..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
            allowClear
          />
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={loadRequests}
            loading={loading}
          >
            Обновить
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultActiveKey={lastSevenDays[0]?.dateString}
        items={tabItems}
        className="mb-6"
        type="card"
      />
    </div>
  );
}