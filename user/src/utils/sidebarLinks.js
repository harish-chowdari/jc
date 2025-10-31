import { FaCalendarAlt, FaListAlt } from 'react-icons/fa'
const userId = localStorage.getItem('userId')

const navItems = [
    {
        label: 'Sidebar1',
        icon: FaCalendarAlt,
        path: `/home/${userId}/appointment-form`
    },
    {
        label: 'Sidebar2',
        icon: FaListAlt,
        path: `/home/${userId}/view-appointments`
    }
]

export default navItems