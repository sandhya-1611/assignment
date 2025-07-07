import { useState, useMemo } from 'react';
import { 
  CalendarTodayRounded, 
  HistoryRounded, 
  PersonRounded,
  ExitToAppRounded,
  LocalHospitalRounded,
  AddRounded, DarkModeRounded, LightModeRounded,
  MenuRounded,InsertDriveFileRounded, VisibilityRounded, DownloadRounded
} from '@mui/icons-material';
import { 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton, Tooltip, Popover
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../context/themeContext';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Navigation items
const navigationItems = [
  { id: 'upcoming', title: 'Upcoming Appointments', icon: <CalendarTodayRounded /> },
  { id: 'history', title: 'Appointment History', icon: <HistoryRounded /> },
  { id: 'profile', title: 'Profile', icon: <PersonRounded /> },
];

// New appointment dialog component
const NewAppointmentDialog = ({ 
  open, 
  onClose, 
  onSubmit 
}: { 
  open: boolean; 
  onClose: () => void;
  onSubmit: (appointmentData: any) => void;
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    treatment: '',
    notes: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    setFormData({ date: '', time: '', treatment: '', notes: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule New Appointment</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} style={{ marginTop: '10px' }}>
          <TextField
            label="Preferred Date"
            type="date"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
          <TextField
            label="Preferred Time"
            type="time"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
          />
          <TextField
            label="Treatment Type"
            select
            variant="outlined"
            fullWidth
            SelectProps={{ native: true }}
            value={formData.treatment}
            onChange={(e) => setFormData({...formData, treatment: e.target.value})}
          >
            <option value="">Select treatment</option>
            <option value="Routine Cleaning">Routine Cleaning</option>
            <option value="Regular Checkup">Regular Checkup</option>
            <option value="Dental Filling">Dental Filling</option>
            <option value="Teeth Whitening">Teeth Whitening</option>
            <option value="Emergency Visit">Emergency Visit</option>
            <option value="Root Canal">Root Canal</option>
            <option value="Tooth Extraction">Tooth Extraction</option>
          </TextField>
          <TextField
            label="Notes (Optional)"
            multiline
            rows={3}
            variant="outlined"
            placeholder="Any specific concerns or requests..."
            fullWidth
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Schedule Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const renderFilesCell = (files: any[]) => {
  if (!files || files.length === 0) return 'No files';

  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      {files.map((file, index) => (
        <a
          key={index}
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1976d2', fontSize: '0.875rem' }}
        >
          {file.name || `File ${index + 1}`}
        </a>
      ))}
    </Box>
  );
};

const UpcomingAppointmentsContent = ({ 
  onCreateAppointment, 
  upcomingIncidents 
}: { 
  onCreateAppointment: () => void;
  upcomingIncidents: any[];
}) => {
  const nextAppointment = upcomingIncidents[0];
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>Upcoming Appointments</Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        View and manage your scheduled dental appointments.
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddRounded />}
        onClick={onCreateAppointment}
        style={{ marginBottom: '20px' }}
      >
        Schedule New Appointment
      </Button>
      
      <Box display="flex" flexWrap="wrap" gap={2} style={{ marginBottom: '20px' }}>
        <Box flex="1" minWidth="250px">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Next Appointment</Typography>
              {nextAppointment ? (
                <>
                  <Typography color="textSecondary">{formatDate(nextAppointment.appointmentDate)}</Typography>
                  <Typography variant="body2">{formatTime(nextAppointment.appointmentDate)} - {nextAppointment.title}</Typography>
                  <Typography variant="body2">{nextAppointment.description}</Typography>
                  <Typography variant="body2">Status: {nextAppointment.status}</Typography>
                  {/* <Button variant="outlined" size="small" style={{ marginTop: '10px' }}>
                    Reschedule
                  </Button> */}
                </>
              ) : (
                <Typography color="textSecondary">No upcoming appointments</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="250px">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Upcoming This Month</Typography>
              <Typography color="textSecondary">{upcomingIncidents.length} appointments scheduled</Typography>
              <Typography variant="body2">
                {upcomingIncidents.length > 0 
                  ? `Next: ${formatDate(upcomingIncidents[0]?.appointmentDate)}${upcomingIncidents[1] ? ` • Following: ${formatDate(upcomingIncidents[1]?.appointmentDate)}` : ''}`
                  : 'No upcoming appointments'
                }
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Upcoming Appointments List</Typography>
          {upcomingIncidents.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Treatment</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Files</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingIncidents.map((incident) => (
                    <tr key={incident.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px' }}>{formatDate(incident.appointmentDate)}</td>
                      <td style={{ padding: '12px' }}>{formatTime(incident.appointmentDate)}</td>
                      <td style={{ padding: '12px' }}>{incident.title}</td>
                      <td style={{ padding: '12px' }}>{incident.description}</td>
                      <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color:
                            incident.status === 'Completed'
                              ? '#fff'
                              : incident.status === 'Scheduled'
                              ? '#fff'
                              : '#444',
                          backgroundColor:
                            incident.status === 'Completed'
                              ? '#2e7d32' // green
                              : incident.status === 'Scheduled'
                              ? '#1976d2' // blue
                              : '#e0e0e0', // grey for others
                          border: 'none',
                          textAlign: 'center',
                        }}
                      >
                        {incident.status}
                      </span>

                      </td>
                      <td style={{ padding: '12px' }}>
                        <FilesPopover files={incident.files || []} />
                      </td>
                      <td style={{ padding: '12px' }}>${incident.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Typography color="textSecondary">No upcoming appointments found.</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const FilesPopover = ({ files }: { files: any[] }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        onClick={handleOpen}
        startIcon={<InsertDriveFileRounded />}
        variant="outlined"
        size="small"
        sx={{
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: '#444',
          borderColor: '#ccc',
          textTransform: 'none',
          backgroundColor: '#f9f9f9',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          }
        }}
      >
        {files.length}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 1, minWidth: 200 } }}
      >
        {files.length === 0 ? (
          <Typography sx={{ p: 1 }}>No files</Typography>
        ) : (
          files.map((file, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" p={0.5}>
              <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
                {file.name || `File ${index + 1}`}
              </Typography>
              <Box>
                <Tooltip title="Preview">
                  <IconButton size="small" href={file.url} target="_blank">
                    <VisibilityRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton size="small" href={file.url} download>
                    <DownloadRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))
        )}
      </Popover>
    </>
  );
};


const AppointmentHistoryContent = ({ completedIncidents }: { completedIncidents: any[] }) => {
  const currentYear = new Date().getFullYear();
  const thisYearIncidents = completedIncidents.filter(incident => 
    new Date(incident.appointmentDate).getFullYear() === currentYear
  );
  const lastAppointment = completedIncidents[0];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Appointment History</Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        View your completed and past appointments.
      </Typography>
      
      <Box display="flex" flexWrap="wrap" gap={2} style={{ marginBottom: '20px' }}>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Appointments
              </Typography>
              <Typography variant="h5" component="div">
                {completedIncidents.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                This Year
              </Typography>
              <Typography variant="h5" component="div">
                {thisYearIncidents.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1" minWidth="200px">
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Last Appointment
              </Typography>
              <Typography variant="h5" component="div">
                {lastAppointment ? formatDate(lastAppointment.appointmentDate).split(',')[0] : 'None'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Appointment History</Typography>
          {completedIncidents.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Treatment</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Cost</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Files</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {completedIncidents.map((incident) => (
                    <tr key={incident.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px' }}>{formatDate(incident.appointmentDate)}</td>
                      <td style={{ padding: '12px' }}>{incident.title}</td>
                      <td style={{ padding: '12px' }}>{incident.description}</td>
                      <td style={{ padding: '12px' }}>${incident.cost}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color:
                          incident.status === 'Completed'
                            ? '#fff'
                            : incident.status === 'Scheduled'
                            ? '#fff'
                            : '#444',
                        backgroundColor:
                          incident.status === 'Completed'
                            ? '#2e7d32' // green
                            : incident.status === 'Scheduled'
                            ? '#1976d2' // blue
                            : '#e0e0e0', // grey for others
                        border: 'none',
                        textAlign: 'center',
                      }}
                    >
                      {incident.status}
                    </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <FilesPopover files={incident.files || []} />
                      </td>
                      <td style={{ padding: '12px' }}>{incident.comments || 'No comments'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Typography color="textSecondary">No appointment history found.</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


const ProfileContent = ({ user, patient }: { user: any; patient: any }) => {
  const { updatePatient } = useData();

  const [formData, setFormData] = useState({
    name: patient?.name || user?.name || '',
    email: user?.email || '',
    contact: patient?.contact || '',
    dob: patient?.dob || '',
    address: patient?.address || '',
  });

  const handleUpdateProfile = () => {
    if (!patient?.id) return;

    const updatedPatient = {
      ...patient,
      name: formData.name,
      contact: formData.contact,
      dob: formData.dob,
      address: formData.address,
    };

    updatePatient(patient.id, updatedPatient);
    alert('Profile updated successfully!');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Patient Profile</Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        Manage your personal information and preferences.
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={3}>
        <Box flex="1" minWidth="400px">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  variant="outlined"
                />
                <TextField
                  label="Email"
                  value={formData.email}
                  disabled
                  variant="outlined"
                />
                <TextField
                  label="Phone"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  variant="outlined"
                />
                <TextField
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Box>
              <Button
                variant="contained"
                style={{ marginTop: '15px' }}
                onClick={handleUpdateProfile}
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1" minWidth="300px">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Medical Information</Typography>
              <Typography variant="body2" style={{ marginBottom: '10px' }}>
                Health Information: {patient?.healthInfo || 'No information available'}
              </Typography>
              <Typography variant="body2" style={{ marginBottom: '10px' }}>
                Insurance Provider: Not specified
              </Typography>
              <Typography variant="body2" style={{ marginBottom: '10px' }}>
                Policy Number: Not specified
              </Typography>
              <Typography variant="body2" style={{ marginBottom: '10px' }}>
                Emergency Contact: Not specified
              </Typography>
              <Typography variant="body2" style={{ marginBottom: '15px' }}>
                Patient ID: {patient?.id || 'N/A'}
              </Typography>
            </CardContent>
          </Card>

          <Card style={{ marginTop: '20px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Account Information</Typography>
              <Typography variant="body2" style={{ marginBottom: '10px' }}>
                User ID: {user?.id || 'N/A'}
              </Typography>
              <Typography variant="body2" style={{ marginBottom: '10px' }}>
                Account Type: {user?.isAdmin ? 'Admin' : 'Patient'}
              </Typography>
              <Typography variant="body2" style={{ marginBottom: '15px' }}>
                Linked Patient ID: {user?.patientId || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </div>
  );
};

export default function PatientDashboard() {
  const [currentPage, setCurrentPage] = useState('upcoming');
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => {
  setDrawerOpen(!drawerOpen);
};
  const { user, logOut } = useAuth();
  const { getIncidentsByPatientId, getPatientById, addIncident, isLoading } = useData();

  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const isDarkMode = theme.palette.mode === 'dark';

  const patient = user?.patientId ? getPatientById(user.patientId) : null;
  const allIncidents = user?.patientId ? getIncidentsByPatientId(user.patientId) : [];

  const { upcomingIncidents, completedIncidents } = useMemo(() => {
    const now = new Date();
    const upcoming = allIncidents.filter(incident => 
      incident.status === 'Scheduled' || incident.status === 'In Progress' || 
      new Date(incident.appointmentDate) > now
    ).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    
    const completed = allIncidents.filter(incident => 
      incident.status === 'Completed'
    ).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    
    return { upcomingIncidents: upcoming, completedIncidents: completed };
  }, [allIncidents]);

  const handleCreateAppointment = () => {
    setAppointmentDialogOpen(true);
  };

  const handleSubmitAppointment = (appointmentData: any) => {
    if (!user?.patientId) return;
    
    const appointmentDate = `${appointmentData.date}T${appointmentData.time}:00`;
    
    const newIncident = {
      id: '',
      patientId: user.patientId,
      title: appointmentData.treatment,
      description: appointmentData.notes || 'Patient scheduled appointment',
      comments: '',
      appointmentDate: appointmentDate,
      cost: 0,
      status: 'Scheduled',
      files: []
    };
    
    addIncident(newIncident);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Typography>Loading...</Typography>;
    }

    switch (currentPage) {
      case 'upcoming':
        return <UpcomingAppointmentsContent 
          onCreateAppointment={handleCreateAppointment} 
          upcomingIncidents={upcomingIncidents}
        />;
      case 'history':
        return <AppointmentHistoryContent completedIncidents={completedIncidents} />;
      case 'profile':
        return <ProfileContent user={user} patient={patient} />;
      default:
        return <UpcomingAppointmentsContent 
          onCreateAppointment={handleCreateAppointment} 
          upcomingIncidents={upcomingIncidents}
        />;
    }
  };

const drawerWidth = 250;
const miniDrawerWidth = 104;

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuRounded />
          </IconButton>
          <LocalHospitalRounded sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            DentalFlow - Patient Portal
          </Typography>
          <IconButton color="inherit" onClick={toggleColorMode}>
            {isDarkMode ? <LightModeRounded /> : <DarkModeRounded />}
          </IconButton>
          <Button color="inherit" onClick={logOut} startIcon={<ExitToAppRounded />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
  variant="permanent"
  open={drawerOpen}
  sx={{
    width: drawerOpen ? drawerWidth : miniDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      width: drawerOpen ? drawerWidth : miniDrawerWidth,
      overflowX: 'hidden',
      overflowY: 'hidden',
      scrollbarWidth: 'none', 
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  }}
>

        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
  {navigationItems.map((item) => (
    <ListItem key={item.id} disablePadding sx={{ justifyContent: 'center' }}>
      <ListItemButton
  onClick={() => setCurrentPage(item.id)}
  selected={currentPage === item.id}
  sx={{
    flexDirection: drawerOpen ? 'row' : 'column',
    alignItems: drawerOpen ? 'center' : 'center',
    textAlign: drawerOpen ? 'center' : 'center',
    py: 1,
    minHeight: 72,
    px: drawerOpen ? 2 : 1,
  }}
>
  <ListItemIcon
    sx={{
      minWidth: 0,
      mr: drawerOpen ? 2 : 0,
      justifyContent: 'center',
    }}
  >
    {item.icon}
  </ListItemIcon>

  <ListItemText
    primary={item.title}
    primaryTypographyProps={{
      variant: 'caption',
      sx: {
        fontSize: drawerOpen ? '0.875rem' : '10px',
        lineHeight: 1.2,
        wordBreak: drawerOpen ? 'normal' : 'break-word',
        whiteSpace: drawerOpen ? 'nowrap' : 'normal',
        maxWidth: drawerOpen ? 'none' : miniDrawerWidth - 16,
        textAlign: drawerOpen ? 'left' : 'center',
      },
    }}
    sx={{ m: 0 }}
  />
</ListItemButton>

    </ListItem>
  ))}
</List>

        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>

      <NewAppointmentDialog 
        open={appointmentDialogOpen} 
        onClose={() => setAppointmentDialogOpen(false)}
        onSubmit={handleSubmitAppointment}
      />
    </Box>
    </ThemeProvider>
  );
}