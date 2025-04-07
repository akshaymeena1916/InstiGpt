

import React, { useState, useRef, useEffect } from "react"
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  useMediaQuery,
  AppBar,
  Toolbar,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import PersonIcon from "@mui/icons-material/Person"
import MenuIcon from "@mui/icons-material/Menu"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import axios from "axios"
// import 'dotenv/config'

const api_key = process.env.REACT_APP_API_KEY


// Sample chat history data
const sampleChats = [
  {
    id: 1,
    title: "Hostel Accommodation",
    lastMessage: "What are the hostel options?",
    timestamp: new Date(Date.now() - 3600000 * 2),
    unread: 0,
  },
  {
    id: 2,
    title: "Course Registration",
    lastMessage: "When does registration open?",
    timestamp: new Date(Date.now() - 3600000 * 24),
    unread: 2,
  },
  {
    id: 3,
    title: "Library Resources",
    lastMessage: "How do I access e-journals?",
    timestamp: new Date(Date.now() - 3600000 * 48),
    unread: 0,
  },
  {
    id: 4,
    title: "Exam Schedule",
    lastMessage: "When are the final exams?",
    timestamp: new Date(Date.now() - 3600000 * 72),
    unread: 1,
  },
  {
    id: 5,
    title: "Campus Facilities",
    lastMessage: "Where is the health center?",
    timestamp: new Date(Date.now() - 3600000 * 96),
    unread: 0,
  },
]

const InstiGPT = () => {
  const [messages, setMessages] = useState([
    {
      content: "Hi! I'm InstiGPT. How can I help you with institute matters today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeChat, setActiveChat] = useState(0)
  const [chats, setChats] = useState(sampleChats)
  const isMobile = useMediaQuery("(max-width:900px)")
  const [darkMode, setDarkMode] = useState(true)

  // Create theme based on current mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2",
      },
      divider: darkMode ? "#333" : "#e0e0e0",
    },
  })

  // Drawer width
  const drawerWidth = 300

  // Sample institute knowledge base
  // const instituteKnowledge = {
  //   hostel: `Hostel matters are handled by the hostel office. Here are some key contacts:
  //             - Hostel Office: hostel@insti.edu, Phone: 1234567890
  //             - Warden: warden@insti.edu
  //             Office hours: 9 AM to 5 PM (Monday to Friday)`,
  //   academic: `Academic queries can be directed to:
  //               - Department office
  //               - Institute academic section
  //               - Student academic committee
  //               Important links:
  //               - Academic calendar: https://insti.edu/academic-calendar
  //               - Course portal: https://courses.insti.edu`,
  //   event: `Upcoming institute events:
  //            - Tech Fest: March 15-17
  //            - Cultural Fest: April 5-7
  //            Check notice boards or the institute app for updates.`,
  //   library: `Library information:
  //              - Timing: 8 AM to 10 PM (Mon-Sat), 10 AM to 6 PM (Sun)
  //              - Contact: library@insti.edu
  //              - Online portal: https://library.insti.edu`,
  //   default: `I'm still learning about institute matters. Could you please provide more details about your query? 
  //              I can help with hostel, academic, event, and library related questions.`,
  // }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Toggle theme mode
  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const handleSend = async () => {
    console.log('1. handleSend triggered with input:', input);
    
    if (!input.trim()) {
      console.log('1a. Empty input detected, returning early');
      return;
    }
  
    // Add user message immediately
    const userMessage = { 
      content: input, 
      sender: 'user',
      timestamp: new Date()
    };
    console.log('2. Adding user message to state:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    console.log('3. Set loading state to true and cleared input');
    console.log(process.env.REACT_APP_API_KEY);
  
    try {
      console.log('4. Checking local knowledge base...');
      
      // First check local knowledge
      // const localResponse = checkLocalKnowledge(input);
      // console.log('5. Local knowledge check result:', localResponse ? 'Found match' : 'No match');
      
      // if (localResponse) {
      //   const botMessage = {
      //     content: localResponse,
      //     sender: 'bot',
      //     timestamp: new Date()
      //   };
      //   console.log('6. Adding local response to messages:', botMessage);
      //   setMessages(prev => [...prev, botMessage]);
      //   return;
      // }
  
      console.log('7. Preparing OpenAI API request...');
      console.log('7a. Using API Key:', api_key ? 'Exists' : 'MISSING!');
      console.log('7b. Request payload:', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are InstiGPT, a helpful assistant for IIT Madras students. Provide concise, factual answers about institute matters.'
          },
          {
            role: 'user',
            content: input
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });
  
      // Only call OpenAI if no local match
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are InstiGPT, a helpful assistant for IIT Madras students. Provide concise, factual answers about institute matters.'
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${api_key}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 second timeout
        }
      );
  
      console.log('8. API Response received:', {
        status: response.status,
        data: response.data
      });
      
      const botMessage = {
        content: response.data.choices[0].message.content,
        sender: 'bot',
        timestamp: new Date()
      };
      console.log('9. Adding bot response to messages:', botMessage);
      setMessages(prev => [...prev, botMessage]);
  
    } catch (error) {
      console.error('10. API Error occurred:', {
        name: error.name,
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      const errorMessage = {
        content: error.response?.data?.error?.message || 
                "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      console.log('11. Adding error message to chat:', errorMessage);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      console.log('12. Final cleanup - setting loading to false');
      setIsLoading(false);
    }
  };
  
  // const checkLocalKnowledge = (message) => {
  //   const lowerMessage = message.toLowerCase();
    
  //   if (lowerMessage.includes("hostel")) {
  //     return instituteKnowledge["hostel"];
  //   }
  //   if (lowerMessage.includes("academic") || lowerMessage.includes("course")) {
  //     return instituteKnowledge["academic"];
  //   }
  //   if (lowerMessage.includes("event") || lowerMessage.includes("fest")) {
  //     return instituteKnowledge["event"];
  //   }
  //   if (lowerMessage.includes("library") || lowerMessage.includes("book")) {
  //     return instituteKnowledge["library"];
  //   }
    
  //   return instituteKnowledge["default"]; // Fallback to default message
  // };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (dayDiff === 0) {
      return formatTime(date)
    } else if (dayDiff === 1) {
      return "Yesterday"
    } else if (dayDiff < 7) {
      return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()]
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId)
    // Mark as read
    setChats(chats.map((chat) => (chat.id === chatId ? { ...chat, unread: 0 } : chat)))
    if (isMobile) {
      setDrawerOpen(false)
    }
  }

  const handleNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: "New Conversation",
      lastMessage: "Start a new conversation",
      timestamp: new Date(),
      unread: 0,
    }
    setChats([newChat, ...chats])
    setActiveChat(newChat.id)
    setMessages([
      {
        content: "Hi! I'm InstiGPT. How can I help you with institute matters today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ])
    if (isMobile) {
      setDrawerOpen(false)
    }
  }

  const drawer = (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Conversations
        </Typography>
        <IconButton onClick={handleNewChat}>
          <AddIcon />
        </IconButton>
      </Box>
      <List sx={{ p: 0 }}>
        {chats.map((chat) => (
          <React.Fragment key={chat.id}>
            <ListItem
              onClick={() => handleChatSelect(chat.id)}
              selected={activeChat === chat.id}
              sx={{
                px: 2,
                py: 1.5,
                cursor: "pointer",
                "&.Mui-selected": {
                  bgcolor: theme.palette.mode === 'dark' ? theme.palette.action.selected : theme.palette.action.hover,
                  "&:hover": {
                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.action.selected : theme.palette.action.hover,
                  },
                },
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  badgeContent={chat.unread}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: theme.palette.error.main,
                      color: theme.palette.error.contrastText,
                    },
                  }}
                >
                  <Avatar sx={{ bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.primary.light }}>
                    <SmartToyIcon />
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{
                      fontWeight: chat.unread > 0 ? "bold" : "normal",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {chat.title}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      color: theme.palette.text.secondary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {chat.lastMessage}
                  </Typography>
                }
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.disabled,
                  ml: 1,
                  minWidth: 40,
                  textAlign: 'right'
                }}
              >
                {formatDate(chat.timestamp)}
              </Typography>
            </ListItem>
            <Divider sx={{ bgcolor: theme.palette.divider }} />
          </React.Fragment>
        ))}
      </List>
    </>
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Sidebar for desktop */}
        {!isMobile && (
          <Box
            component="nav"
            sx={{
              width: { sm: drawerWidth },
              flexShrink: { sm: 0 },
            }}
          >
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                  borderRight: `1px solid ${theme.palette.divider}`,
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
        )}
  
        {/* Temporary drawer for mobile */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            {drawer}
          </Drawer>
        )}
  
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Mobile App Bar */}
          {isMobile && (
            <AppBar
              position="static"
              sx={{
                bgcolor: "background.paper",
                boxShadow: "none",
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Toolbar>
                <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  InstiGPT
                </Typography>
                <IconButton onClick={toggleTheme} sx={{ mr: 2 }}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleNewChat}
                  variant="outlined"
                  sx={{
                    borderColor: "divider",
                    "&:hover": {
                      bgcolor: "action.hover",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  New Chat
                </Button>
              </Toolbar>
            </AppBar>
          )}
  
          {/* Desktop Header */}
          {!isMobile && (
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                InstiGPT
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={toggleTheme}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleNewChat}
                  variant="outlined"
                  sx={{
                    borderColor: "divider",
                    "&:hover": {
                      bgcolor: "action.hover",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  New Chat
                </Button>
              </Box>
            </Box>
          )}
  
          {/* Chat Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                flexGrow: 1,
                overflow: "auto",
                p: 2,
                bgcolor: "transparent",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    mb: 2,
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.sender === "bot" && (
                    <Avatar
                      sx={{
                        bgcolor: "primary.light",
                        mr: 1,
                        alignSelf: "flex-end",
                        boxShadow: 1,
                      }}
                    >
                      <SmartToyIcon />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      maxWidth: "80%",
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        bgcolor: msg.sender === "user" ? "primary.light" : "background.paper",
                        borderRadius: msg.sender === "user" ? "18px 18px 0 18px" : "18px 18px 18px 0",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="body1">{msg.content}</Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{
                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                        color: "text.secondary",
                        mt: 0.5,
                        mx: 1,
                        fontSize: "0.7rem",
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </Box>
                  {msg.sender === "user" && (
                    <Avatar
                      sx={{
                        bgcolor: "secondary.light",
                        ml: 1,
                        alignSelf: "flex-end",
                        boxShadow: 1,
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                  )}
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.light",
                      mr: 1,
                      boxShadow: 1,
                    }}
                  >
                    <SmartToyIcon />
                  </Avatar>
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: "70%",
                      bgcolor: "background.paper",
                      borderRadius: "18px 18px 18px 0",
                      border: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography>InstiGPT is typing</Typography>
                    </Box>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Paper>
          </Box>
  
          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                maxWidth: 800,
                margin: "0 auto",
                width: "100%",
              }}
            >
              <TextField
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                placeholder="Ask me anything about the institute..."
                variant="outlined"
                sx={{
                  mr: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "background.default",
                    "& fieldset": {
                      borderColor: "divider",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.light",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
                disabled={isLoading}
              />
              <IconButton
                onClick={handleSend}
                disabled={isLoading || input.trim() === ""}
                sx={{
                  height: 56,
                  width: 56,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "action.disabledBackground",
                    color: "action.disabled",
                  },
                  boxShadow: 1,
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default InstiGPT