import { useEffect, useState, useRef } from "react";
import logowhite from "../assets/kavsar.png";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetZayavki } from "../Api/zayavkiapi";
import { Dropdown, Badge, Avatar, Tooltip, Drawer } from "antd";
import toast from "react-hot-toast";

const Layout = () => {
  const placeholders = ["Поиск...", "Найти заявку...", "Найти клиента...", "Поиск по сайту..."];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 800);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 800);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [todayRequests, setTodayRequests] = useState([]);
  const searchInputRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { data: requests } = useSelector((state) => state.ZayavkiSlicer);

  // Тафтиши токен ҳар 5 сония
  useEffect(() => {
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Сессия ба охир расид. Лутфан, аз нав ворид шавед.");
        window.location.href = "/admin";
      }
    }, 5000);
    
    return () => clearInterval(tokenCheckInterval);
  }, []);

  // Санҷиши заявкаҳои нав ҳар дақиқа
  useEffect(() => {
    checkNewRequests();

    const checkInterval = setInterval(() => {
      dispatch(GetZayavki());
    }, 60000); 

    return () => clearInterval(checkInterval);
  }, [requests, dispatch]);

  // Танзими муносибгардонии экран (responsive)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobileView(width < 800);
      if (width < 800 && isSidebarOpen) {
        setSidebarOpen(false);
      } else if (width >= 800 && !isSidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Санҷиши заявкаҳои нав
  const checkNewRequests = () => {
    if (!requests || !Array.isArray(requests)) return;
    
    const today = new Date().toDateString();
    const newTodayRequests = requests.filter(
      (req) => new Date(req.createdAt).toDateString() === today && !req.isApproved
    );
    
    setHasNewRequests(newTodayRequests.length > 0);
    setTodayRequests(newTodayRequests);
  };

  // Бекор кардани нишондиҳандаи заявкаҳои нав ҳангоми рафтан ба саҳифаи заявкаҳо
  useEffect(() => {
    if (location.pathname === "/zayavki") {
      setHasNewRequests(false);
    }
    
    if (isMobileView) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobileView]);

  // Тағйири placeholder дар ҷустуҷӯ
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Фокус ба ҷустуҷӯ ҳангоми кушодани он
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Рӯйхати бандҳои менюи асосӣ
  const menuItems = [
    { path: "/", icon: "bx-home-alt", label: "Главная", description: "Обзор панели управления" },
    { 
      path: "/zayavki", 
      icon: "bx-list-ol", 
      label: "Заявки",
      description: "Управление заявками пользователей",
      notification: hasNewRequests
    },
    { 
      path: "/Otzivi", 
      icon: "bx-star", 
      label: "Отзывы",
      description: "Управление отзывами пользователей"
    },
    { 
      path: "/DesignPage", 
      icon: "bx-palette", 
      label: "Дизайн интерьера",
      description: "Управление дизайном интерьера"
    }
  ];

  // Функсияҳои асосӣ
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    toast.success("Вы успешно вышли из системы");
    navigate("/admin");
  };

  // Тугмаи санҷиши токен (тоза кардани токен) - барои санҷиш
  const destroyTokenForTesting = () => {
    localStorage.removeItem("access_token");
  };

  // Бандҳои менюи корбар
  const userMenuItems = [
    {
      type: "divider"
    },
    {
      key: "logout",
      label: (
        <div className="px-1 py-1">
          <div className="flex items-center text-red-500">
            <i className="bx bx-log-out text-lg mr-2"></i>
            <span>Выйти</span>
          </div>
        </div>
      ),
      onClick: handleLogout
    },
    {
      key: "test-token-expiry",
      label: (
        <div className="px-1 py-1">
          <div className="flex items-center text-orange-500">
            <i className="bx bx-time-five text-lg mr-2"></i>
            <span>Санҷиши нобудшавии токен</span>
          </div>
        </div>
      ),
      onClick: destroyTokenForTesting
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm text-gray-800 z-30 sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo and menu toggle */}
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="mr-3 p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-600"
              aria-label="Toggle menu"
            >
              <i className={`bx ${isSidebarOpen ? 'bx-menu-alt-left' : 'bx-menu'} text-xl`}></i>
            </button>
            <div className="flex items-center">
              <img src={logowhite} className="h-8 mr-2" alt="Kavsar Logo" />
              <h1 className="text-lg font-bold hidden sm:block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Kavsar Admin
              </h1>
            </div>
          </div>

          {/* Search and User */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Search button on mobile */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <i className="bx bx-search text-xl"></i>
            </button>

            {/* Search Input (Desktop) */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bx bx-search text-gray-400"></i>
              </div>
              <input
                type="search"
                placeholder={placeholders[placeholderIndex]}
                className="w-48 lg:w-72 bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition-all duration-300"
              />
            </div>

            {/* Notifications */}
            <Tooltip title="Уведомления">
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                  aria-label="Notifications"
                >
                  <Badge dot={hasNewRequests} color="red" offset={[-2, 2]}>
                    <i className="bx bx-bell text-xl"></i>
                  </Badge>
                </button>
              </div>
            </Tooltip>

            {/* User Menu */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
              onOpenChange={setIsUserMenuOpen}
              open={isUserMenuOpen}
            >
              <div className="flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-100">
                <Avatar
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md"
                  size={36}
                >A</Avatar>
                <div className="hidden sm:block ml-2 mr-1">
                  <p className="text-sm font-medium leading-tight">Администратор</p>
                  <p className="text-xs text-gray-500">Супер админ</p>
                </div>
                <i className={`bx ${isUserMenuOpen ? 'bx-chevron-up' : 'bx-chevron-down'} text-gray-500`}></i>
              </div>
            </Dropdown>
          </div>
        </div>

        {/* Mobile search overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-3 md:hidden z-50 shadow-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bx bx-search text-gray-400"></i>
              </div>
              <input
                ref={searchInputRef}
                type="search"
                placeholder={placeholders[placeholderIndex]}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleSearch}
              >
                <i className="bx bx-x text-gray-400 text-xl"></i>
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay for mobile when sidebar is open */}
        {isMobileView && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Sidebar */}
        <aside 
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${
            isMobileView ? 'fixed top-16 bottom-0 left-0 w-64' : 'w-64'
          } bg-white border-r border-gray-200 text-gray-700 transition-all duration-300 ease-in-out flex flex-col shadow-sm z-20`}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-lg text-blue-800">Панель управления</h2>
            {!isMobileView && (
              <button 
                onClick={toggleSidebar}
                className="p-1 rounded hover:bg-gray-100 text-gray-500 focus:outline-none"
                aria-label="Collapse sidebar"
              >
                <i className="bx bx-chevron-left text-xl"></i>
              </button>
            )}
          </div>

          {/* Sidebar content */}
          <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobileView && setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 mx-2 rounded-lg ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                } transition-all duration-200 relative group`}
              >
                <i className={`bx ${item.icon} text-xl ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`}></i>
                <div className="ml-3 flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-gray-500">{item.description}</span>
                </div>
                
                {/* Индикатор новых заявок */}
                {item.notification && (
                  <Badge dot color="red" className="ml-auto" />
                )}
              </Link>
            ))}
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Системная информация</h3>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Версия:</span>
                <span>1.2.5</span>
              </div>
              <div className="flex justify-between">
                <span>Последнее обновление:</span>
                <span>15.04.2025</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={`flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 transition-all ${isMobileView && isSidebarOpen ? 'blur-sm' : ''}`}>
          <Outlet />
        </main>

        {/* Notifications drawer */}
        <Drawer
          title="Уведомления"
          placement="right"
          onClose={toggleNotifications}
          open={isNotificationsOpen}
          width={320}
        >
          <div className="space-y-4">
            {todayRequests.length > 0 ? (
              <>
                {todayRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="p-3 rounded-lg border bg-blue-50 border-blue-100"
                  >
                    <div className="flex justify-between mb-1">
                      <h3 className="text-sm font-medium text-blue-700">
                        Новая заявка #{request.id}
                      </h3>
                      <Badge color="blue" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {request.name ? `От клиента: ${request.name}` : 'Новая заявка'}
                      {request.phone && `, тел: ${request.phone}`}
                    </p>
                    <div className="text-xs text-gray-500 flex items-center">
                      <i className="bx bx-time-five mr-1"></i>
                      {new Date(request.createdAt).toLocaleString()}
                    </div>
                    <div className="mt-2">
                      <Link 
                        to="/zayavki" 
                        onClick={toggleNotifications}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Перейти к заявкам
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <i className="bx bx-bell-off text-4xl mb-2"></i>
                <p>Новых уведомлений нет</p>
              </div>
            )}

            {todayRequests.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <Link 
                  to="/zayavki"
                  onClick={toggleNotifications}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium block w-full text-center"
                >
                  Посмотреть все заявки
                </Link>
              </div>
            )}
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Layout;