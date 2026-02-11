// Icons
import {
    Shield, Phone, Ticket, Flame, AlertTriangle,
    GraduationCap, Leaf, Recycle, Baby, Fingerprint,
    Info, Bus, Ambulance, HeartPulse, Calendar,
} from 'lucide-react'

export const SECTION_DATA = {
    environment: {
        title: "Environment",
        subtitle: "Apps",
        items: [
            { id: 1, img: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop", link: '/Information', label: 'City Pulse', icon: Info, desc: "Real-time Density", stat: "Live" },
            { id: 2, img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop", link: '/Transport', label: 'Mobility', icon: Bus, desc: "Traffic Control", stat: "98%" },
            { id: 3, img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2032&auto=format&fit=crop", link: '/Emergency', label: 'Response', icon: Ambulance, desc: "Emergency Units", stat: "2min" },
            { id: 4, img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop", link: '/Health', label: 'E-Health', icon: HeartPulse, desc: "Medical Records", stat: "Secure" },
            { id: 5, img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop", link: '/Calendar', label: 'Events', icon: Calendar, desc: "City Agenda", stat: "12 Actv" },
        ]
    },
    education: {
        title: "Education Center",
        subtitle: "Curriculum",
        items: [
            { id: "01", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop", link: '/education-center', label: 'Digital Academy', icon: GraduationCap, desc: "Digital citizenship basics.", status: "Open" },
            { id: "02", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1527&auto=format&fit=crop", link: '/green', label: 'Eco Awareness', icon: Leaf, desc: "Sustainability guides.", status: "New" },
            { id: "03", img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop", link: '/recycling', label: 'Waste Management', icon: Recycle, desc: "Recycling protocols.", status: "Open" },
            { id: "04", img: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=2069&auto=format&fit=crop", link: '/smart-child', label: 'Child Development', icon: Baby, desc: "Parenting resources.", status: "Updated" },
            { id: "05", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", link: '/digital-footprints', label: 'Cyber Security', icon: Fingerprint, desc: "Data privacy.", status: "Premium" },
        ]
    },
    security: {
        title: "Security & Safety",
        subtitle: "Services",
        items: [
            { img: "https://images.unsplash.com/photo-1555617766-c94804975da3?q=80&w=2070&auto=format&fit=crop", link: '/traffic', label: 'Traffic AI', icon: Ticket, span: 'col-span-1 md:col-span-2' },
            { img: "https://images.unsplash.com/photo-1495542779398-9fec7dc796dd?q=80&w=1978&auto=format&fit=crop", link: '/child-protection', label: 'Child Safety', icon: Shield, span: 'col-span-1 md:col-span-1 md:row-span-2' },
            { img: "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=2000&auto=format&fit=crop", link: '/police-call-center', label: 'Police Center', icon: Phone, span: 'col-span-1 md:col-span-1' },
            { img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop", link: '/fireman-call-center', label: 'Fire Response', icon: Flame, span: 'col-span-1 md:col-span-2' },
            { img: "https://images.unsplash.com/photo-1599233078028-1f56b77227dc?q=80&w=1929&auto=format&fit=crop", link: '/regional-disaster', label: 'Disaster Relief', icon: AlertTriangle, span: 'col-span-1 md:col-span-2' },
        ]
    }
}