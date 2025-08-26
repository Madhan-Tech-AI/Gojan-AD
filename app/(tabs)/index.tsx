import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Linking,
  Animated,
  PanResponder,
} from 'react-native';
import { router } from 'expo-router';
import { GraduationCap, MapPin, Phone, Mail, MessageCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const departments = [
  {
    id: '1',
    name: 'Computer Science Engineering',
    description: 'Advanced computing, software development, and emerging technologies',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg'
  },
  {
    id: '2',
    name: 'Information Technology',
    description: 'IT systems, network management, and digital infrastructure',
    image: 'https://images.pexels.com/photos/325111/pexels-photo-325111.jpeg'
  },
  {
    id: '3',
    name: 'Electronics & Communication',
    description: 'Electronic systems, telecommunications, and signal processing',
    image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg'
  },
  {
    id: '4',
    name: 'Mechanical Engineering',
    description: 'Machine design, manufacturing, and mechanical systems',
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg'
  },
  {
    id: '5',
    name: 'Civil Engineering',
    description: 'Infrastructure development, construction, and urban planning',
    image: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg'
  },
  {
    id: '6',
    name: 'Electrical Engineering',
    description: 'Power systems, electrical design, and renewable energy',
    image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg'
  },
  {
    id: '7',
    name: 'Business Administration',
    description: 'Management principles, business strategy, and leadership',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
  },
  {
    id: '8',
    name: 'Master of Commerce',
    description: 'Advanced accounting, finance, and business analytics',
    image: 'https://images.pexels.com/photos/210574/pexels-photo-210574.jpeg'
  },
  {
    id: '9',
    name: 'Arts & Science',
    description: 'Liberal arts education with interdisciplinary approach',
    image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'
  },
  {
    id: '10',
    name: 'Data Science',
    description: 'Big data analytics, machine learning, and statistical modeling',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg'
  },
  {
    id: '11',
    name: 'Biotechnology',
    description: 'Biological sciences, genetic engineering, and medical research',
    image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg'
  },
  {
    id: '12',
    name: 'Aerospace Engineering',
    description: 'Aircraft design, space technology, and aerodynamics',
    image: 'https://images.pexels.com/photos/355935/pexels-photo-355935.jpeg'
  }
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const ctaScale = useRef(new Animated.Value(1)).current;
  const [showChat, setShowChat] = React.useState(false);
  const [chatInput, setChatInput] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<{ id: string; role: 'user' | 'assistant'; text: string }[]>([
    { id: 'c1', role: 'assistant', text: 'Hi! Ask about appointment or admission process, or campus facilities.' }
  ]);
  const chatSlide = useRef(new Animated.Value(0)).current; // 0 hidden, 1 shown
  const screen = Dimensions.get('window');
  const pan = useRef(new Animated.ValueXY({ x: Math.max(16, screen.width - 80), y: 120 })).current;
  const chatAnchor = useRef({ x: Math.max(16, screen.width - 80), y: 120 }).current;
  const movedRef = useRef(false);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        movedRef.current = false;
        const cur = (pan as any).__getValue();
        pan.setOffset({ x: cur.x, y: cur.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gesture) => {
        if (!movedRef.current && (Math.abs(gesture.dx) + Math.abs(gesture.dy)) > 10) {
          movedRef.current = true;
        }
        Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(evt, gesture);
      },
      onPanResponderRelease: (_evt, gesture) => {
        pan.flattenOffset();
        const cur = (pan as any).__getValue();
        // Clamp within screen bounds
        const margin = 8;
        const btnSize = 44;
        const clampedX = Math.max(margin, Math.min(cur.x, screen.width - btnSize - margin));
        const clampedY = Math.max(60, Math.min(cur.y, screen.height - btnSize - 60));
        pan.setValue({ x: clampedX, y: clampedY });
        if (!movedRef.current) {
          openChat();
        }
      },
    })
  ).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaScale, { toValue: 1.04, duration: 900, useNativeDriver: true }),
        Animated.timing(ctaScale, { toValue: 1.0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleDepartmentPress = (department: any) => {
    router.push({
      pathname: '/booking/appointment',
      params: { department: department.name, departmentId: department.id }
    });
  };

  const handleAdmissionPress = () => {
    router.push('/(tabs)/admission');
  };

  const styles = createStyles(colors);
  const handleChatSend = () => {
    const text = chatInput.trim();
    if (!text) return;
    const add = (role: 'user' | 'assistant', t: string) => setChatMessages(prev => [...prev, { id: Date.now().toString()+Math.random(), role, text: t }]);
    add('user', text);
    setChatInput('');

    const lower = text.toLowerCase();
    let reply = '';
    if (/appointment/.test(lower)) {
      reply = 'To book an appointment, choose a department and pick a weekday date. You’ll receive confirmation and assigned slot soon.';
    } else if (/admission/.test(lower)) {
      reply = 'Admission process: apply online, submit required documents (10th/12th, TC, ID), and attend counselling. Our team will guide you throughout.';
    } else if (/infrastructure|campus|classroom|lab|library/.test(lower)) {
      reply = 'Our campus features smart classrooms, modern labs, a rich library, and conference halls supporting practical learning.';
    } else if (/food|canteen|mess/.test(lower)) {
      reply = 'Canteen offers hygienic, tasty food with multiple options for students throughout the day.';
    } else if (/sport|game|ground|court|track/.test(lower)) {
      reply = 'We support diverse sports with cricket ground, volleyball, badminton, tennis, basketball courts and an athletics track.';
    } else if (/hostel/.test(lower)) {
      reply = 'Separate hostels provide a safe, comfortable stay with essential amenities and study-friendly environment.';
    } else if (/faculty|staff|teacher/.test(lower)) {
      reply = 'Experienced and supportive faculty mentor students with a focus on fundamentals, projects, and placements.';
    } else if (/contact|phone|email|map|address/.test(lower)) {
      reply = 'Call: 044-26311045 | +91 70107 23984 • Email: gsbt@gsbt.edu.in • Address: Gojan College Road, Redhills, Chennai - 600052';
    } else {
      reply = "I'm here to help with appointments, admissions, and campus details. Try asking: 'admission process' or 'appointment booking'.";
    }
    setTimeout(() => add('assistant', reply), 200);
  };

  const openChat = () => {
    // Reset chat content each time it's opened
    setChatMessages([{ id: 'c1', role: 'assistant', text: 'Hi! Ask about appointment or admission process, or campus facilities.' }]);
    setChatInput('');
    setShowChat(true);
    // Anchor chat below the current icon position
    const cur = (pan as any).__getValue();
    chatAnchor.x = cur.x;
    chatAnchor.y = cur.y;
    chatSlide.setValue(0);
    Animated.timing(chatSlide, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  };

  const closeChat = () => {
    Animated.timing(chatSlide, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setShowChat(false));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{ uri: 'https://i.pinimg.com/736x/86/74/3f/86743f9ed57ec198d0c422c835978f03.jpg' }}
        style={styles.header}
        imageStyle={styles.headerImage}>
        <View style={styles.headerOverlay}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>
              <Text style={styles.collegeText}>Gojan School of Business and Technology</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
          <TouchableOpacity style={styles.admissionButton} onPress={handleAdmissionPress}>
            <GraduationCap size={24} color="#FFFFFF" />
            <Text style={styles.admissionButtonText}>Book Admission</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.collegeDetails}>
          <Text style={styles.sectionTitle}>College Highlights</Text>
          <View style={styles.chipsRow}>
            {[
              'AICTE Approved',
              'Anna University Affiliated',
              'NAAC Accredited',
              'UGC 2(f) & 12(B) Recognized',
            ].map((t) => (
              <View key={t} style={styles.chip}><Text style={styles.chipText}>{t}</Text></View>
            ))}
          </View>
          <Text style={[styles.detailText, { marginTop: 6 }]}>Gojan College Road, Redhills, Chennai – 600 052</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>20+</Text>
            <Text style={styles.statLabel}>Programs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>10+</Text>
            <Text style={styles.statLabel}>Clubs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8+</Text>
            <Text style={styles.statLabel}>Sports</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Campus Glimpse</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryRow}>
          {[
            'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
            'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
            'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
            'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg',
          ].map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.galleryImage} />
          ))}
        </ScrollView>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Why Choose Gojan</Text>
          <Text style={styles.cardText}>• Strong academics aligned to Anna University with modern curriculum</Text>
          <Text style={styles.cardText}>• Practical learning with labs, projects, and industry collaboration</Text>
          <Text style={styles.cardText}>• Placement preparation, soft-skills, and entrepreneurship support</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Departments Snapshot</Text>
          <Text style={styles.cardText}>• B.E: Aeronautical, CSE (AI&ML), CSE, CSE (Cyber Security), ECE, Mechanical & Automation, Medical Electronics, Computer & Communication, Robotics & Automation</Text>
          <Text style={styles.cardText}>• B.Tech: IT, AI & Data Science, CSBS, Pharmaceutical Technology, Bio Technology</Text>
          <Text style={styles.cardText}>• Science & Humanities, MBA</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Campus & Facilities</Text>
          <Text style={styles.cardText}>• Smart classrooms, modern laboratories, conference halls</Text>
          <Text style={styles.cardText}>• Library, hostel, canteen, transport, health centre</Text>
          <Text style={styles.cardText}>• Sports: Cricket, Volleyball, Badminton, Tennis, Basketball, Track</Text>
          <Text style={styles.cardText}>• Clubs: Reading, Green, English, Photography, Fine Arts, Innovation, NSS, YRC</Text>
        </View>

        <View style={styles.gridGallery}>
          {[
            'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg',
            'https://images.pexels.com/photos/207698/pexels-photo-207698.jpeg',
            'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg',
            'https://images.pexels.com/photos/207703/pexels-photo-207703.jpeg',
          ].map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.gridImage} />
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Placements</Text>
          <Text style={styles.cardText}>• Corporate connect, recruiters network, career framework</Text>
          <Text style={styles.cardText}>• Training & placement support with guidance panel and ED Cell</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Contact</Text>
          <View style={{ gap: 6 }}>
            <View style={styles.contactRow}><Phone size={16} color={colors.textSecondary} /><Text style={styles.cardText}>044-26311045 | +91 70107 23984</Text></View>
            <View style={styles.contactRow}><Mail size={16} color={colors.textSecondary} /><Text style={styles.cardText}>gsbt@gsbt.edu.in</Text></View>
            <View style={styles.contactRow}><MapPin size={16} color={colors.textSecondary} /><Text style={styles.cardText}>Gojan College Road, Edapalayam, Alamathi via, Redhills, Chennai - 600052</Text></View>
          </View>
          <View style={styles.contactActions}>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('tel:+917010723984')}>
              <Text style={styles.contactBtnText}>Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:gsbt@gsbt.edu.in')}>
              <Text style={styles.contactBtnText}>Send Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('https://maps.google.com/?q=Gojan+College+Road,+Edapalayam,+Alamathi+via,+Redhills,+Chennai+-+600052')}>
              <Text style={styles.contactBtnText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </View>
      </ScrollView>
      {/* Draggable Chat Launcher (overlay, home-only) */}
      <Animated.View
        pointerEvents="box-none"
        style={[styles.draggable, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.draggableBtn}>
          <MessageCircle size={24} color="#FFFFFF" />
        </View>
      </Animated.View>

      {/* Floating Chat Panel anchored below icon */}
      {showChat && (
        <View pointerEvents="box-none" style={styles.fixedChatContainer}>
          <Animated.View
            style={[
              styles.chatSheet,
              {
                top: chatAnchor.y + 56,
                left: Math.max(8, Math.min(chatAnchor.x - 280, screen.width - 8 - 320)),
                width: 320,
                transform: [{ scale: chatSlide }],
              },
            ]}
          >
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Assistant</Text>
              <TouchableOpacity onPress={closeChat}>
                <Text style={{ color: colors.textSecondary }}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.chatList} contentContainerStyle={styles.chatListContent} showsVerticalScrollIndicator={false}>
              {chatMessages.map(m => (
                <View key={m.id} style={[styles.chatBubble, m.role==='user' ? styles.chatUser : styles.chatBot]}>
                  <Text style={styles.chatText}>{m.text}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.chatInputBar}>
              <TextInput
                style={styles.chatInput}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Type your question..."
                placeholderTextColor={colors.textSecondary}
                onSubmitEditing={() => handleChatSend()}
                returnKeyType="send"
              />
              <TouchableOpacity style={styles.chatSend} onPress={() => handleChatSend()}>
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Send</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 220,
    justifyContent: 'flex-end',
  },
  headerImage: {
    opacity: 1,
  },
  headerOverlay: {
    // Clean overlay (no glass effects)
    padding: 20,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerChatBtn: {
    backgroundColor: '#28623A',
    padding: 10,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)'
  },
  draggableBtn: {
    backgroundColor: 'rgba(40, 98, 58, 0.9)',
    padding: 10,
    borderRadius: 26,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  collegeText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    maxWidth: '70%',
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  topBar: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  topChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  topChatText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  galleryRow: {
    marginBottom: 20,
  },
  galleryImage: {
    width: 220,
    height: 130,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 20,
  },
  gridImage: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  chatFab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 100,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  fixedChatContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-start',
  },
  chatSheet: {
    width: 320,
    maxHeight: '70%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  draggable: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 50,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  chatList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: '75%',
  },
  chatListContent: { paddingBottom: 500 },
  chatBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  chatUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  chatBot: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chatText: {
    color: '#FFFFFF',
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chatSend: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  contactActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  contactBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  collegeDetails: {
    padding: 16,
    marginBottom: 20,
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  detailItem: {
    marginBottom: 6,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.textPrimary,
  },
  admissionButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  admissionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  departmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  departmentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  departmentImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  departmentContent: {
    padding: 12,
  },
  departmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 18,
  },
  departmentDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});