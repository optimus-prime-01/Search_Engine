import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
    Container,
    Box,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Fade,
    CircularProgress,
    alpha,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Autocomplete from '@mui/material/Autocomplete';

function SearchComponent() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [mode, setMode] = useState('dark');

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const fetchSuggestions = async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/suggest?q=${encodeURIComponent(searchTerm.trim())}`);
            if (response.data && response.data.suggestions) {
                setSuggestions(response.data.suggestions);
            }
        } catch (error) {
            console.error('Suggestion error:', error);
            setSuggestions([]);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a search term');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`http://localhost:3001/search?q=${encodeURIComponent(query.trim())}`);
            
            if (response.data && response.data.hits) {
                setResults(response.data.hits);
                if (response.data.hits.length === 0) {
                    setError('No results found. Try different search terms.');
                }
            } else {
                setResults([]);
                setError('Invalid response format from server');
            }
        } catch (error) {
            console.error('Search error:', error);
            setError(
                error.response?.data?.details || 
                error.response?.data?.error || 
                'Search failed. Please try again.'
            );
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (filename) => {
        try {
            window.open(`http://localhost:3001/download/${filename}`, '_blank');
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode,
                    primary: {
                        main: '#90caf9',
                    },
                    background: {
                        default: mode === 'dark' ? '#121212' : '#ffffff',
                        paper: mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    },
                },
                shape: {
                    borderRadius: 12,
                },
                components: {
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backgroundImage: 'none',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                                },
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                textTransform: 'none',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                },
                            },
                        },
                    },
                },
            }),
        [mode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    mb: 2,
                    position: 'fixed',
                    right: 24,
                    top: 24,
                    zIndex: 1100,
                }}>
                    <IconButton 
                        onClick={toggleColorMode} 
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                            },
                        }}
                    >
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>

                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4,
                        mt: 8,
                        backdropFilter: 'blur(8px)',
                        background: alpha(theme.palette.background.paper, 0.8),
                    }}
                >
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 700,
                            textAlign: 'center',
                            mb: 4,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Bravo Search
                    </Typography>

                    <Box sx={{ mb: 4, position: 'relative' }}>
                        <Autocomplete
                            freeSolo
                            options={suggestions}
                            value={query}
                            onChange={(event, newValue) => {
                                setQuery(newValue || '');
                                if (newValue) handleSearch();
                            }}
                            onInputChange={(event, newInputValue) => {
                                setQuery(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    label="Search PDFs"
                                    placeholder="Enter keywords to search in PDFs..."
                                    disabled={loading}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            '&:hover fieldset': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <Typography variant="body1">
                                        {option}
                                    </Typography>
                                </Box>
                            )}
                            loading={loading}
                            loadingText="Searching..."
                            noOptionsText="No suggestions found"
                            sx={{
                                width: '100%',
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            disabled={loading}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                minWidth: 'auto',
                                px: 2,
                                zIndex: 1,
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <SearchIcon />
                            )}
                        </Button>
                    </Box>

                    {error && (
                        <Fade in={!!error}>
                            <Typography 
                                color="error" 
                                sx={{ 
                                    mb: 2,
                                    textAlign: 'center',
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                }}
                            >
                                {error}
                            </Typography>
                        </Fade>
                    )}

                    <List>
                        {results.map((result) => (
                            <Fade in key={result._id}>
                                <Paper 
                                    sx={{ 
                                        mb: 2,
                                        overflow: 'hidden',
                                    }} 
                                    elevation={2}
                                >
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                <Typography 
                                                    variant="h6"
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        color: theme.palette.primary.main,
                                                    }}
                                                >
                                                    {result._source.metadata.title || result._source.metadata.file_name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box component="div">
                                                    <Typography 
                                                        component="div" 
                                                        variant="body2" 
                                                        color="text.secondary"
                                                        sx={{ mb: 1, mt: 1 }}
                                                    >
                                                        Author: {result._source.metadata.author || 'Unknown'}
                                                    </Typography>
                                                    <Typography
                                                        component="div"
                                                        variant="body2"
                                                        sx={{ 
                                                            mb: 2,
                                                            p: 2,
                                                            borderRadius: 1,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                        }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: result.highlight?.content?.[0] || result._source.content.substring(0, 200) + '...'
                                                        }}
                                                    />
                                                    <Button
                                                        size="medium"
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleDownload(result._source.metadata.file_name)}
                                                        startIcon={<PictureAsPdfIcon />}
                                                        sx={{
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        Download PDF
                                                    </Button>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                </Paper>
                            </Fade>
                        ))}
                    </List>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}
export default SearchComponent;