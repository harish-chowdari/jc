import React, { useState, useEffect } from 'react'
import { ShoppingCart, Search, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import getUserId from '../utils/getUserId'

export default function Header({ cartCount = 0, onSearch, onNavigate }) {
	const [searchQuery, setSearchQuery] = useState('')
	const [liveCount, setLiveCount] = useState(cartCount)
	const [showUserName, setShowUserName] = useState(false)
	const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User')
	const navigate = useNavigate()
	const userId = getUserId()

	useEffect(() => {
		if (!userId) return
		let mounted = true
		const fetchCart = async () => {
			try {
				const res = await axios.get(`http://localhost:5000/api/cart/${userId}`)
				const count = (res.data?.items || []).reduce((s, it) => s + (it.quantity || 0), 0)
				if (mounted) setLiveCount(count)
			} catch (err) {
				console.error('cart poll error', err)
			}
		}
		fetchCart()
		const id = setInterval(fetchCart, 1000)
		return () => {
			mounted = false
			clearInterval(id)
		}
	}, [userId])

	useEffect(() => {
		const fetchUserName = async () => {
			if (!userId) return
			try {
				const res = await axios.get(`http://localhost:5000/api/user/${userId}`)
				setUserName(res.data?.name || 'User')
			} catch (err) {
				console.error('user fetch error', err)
				setUserName('User')
			}
		}
		fetchUserName()
	}, [userId])

	const displayCount = liveCount || 0

	const handleSearch = (e) => {
		e.preventDefault()
		if (onSearch) onSearch(searchQuery)
	}

	const handleUserClick = () => {
		setShowUserName(true)
		setTimeout(() => {
			setShowUserName(false)
		}, 2000)
	}

	const handleLogout = () => {
		// Clear user data from localStorage
		localStorage.removeItem('userId')
		localStorage.removeItem('userToken')
		// Redirect to login page
		navigate('/')
	}

	return (
		<header className="bg-white shadow-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div 
						className="flex items-center space-x-2 cursor-pointer" 
						onClick={() => navigate('/home')}
					>
						<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-xl">J</span>
						</div>
						<h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							JC Universe
						</h1>
					</div>

					<div className="flex items-center space-x-4">

						<div className="relative">
							<button 
								className="text-gray-700 hover:text-blue-600 transition"
								onClick={handleUserClick}
							>
								<User className="w-6 h-6" />
							</button>
							{showUserName && (
								<div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 whitespace-nowrap animate-fade-in">
									<p className="text-sm font-medium text-gray-800">{userName}</p>
								</div>
							)}
						</div>

						<button 
							className="text-gray-700 hover:text-blue-600 transition relative"
							onClick={() => navigate('/cart')}
						>
							<ShoppingCart className="w-6 h-6" />
							{displayCount > 0 && (
								<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
									{displayCount}
								</span>
							)}
						</button>

						<button 
							className="text-gray-700 hover:text-red-600 transition"
							onClick={handleLogout}
							title="Logout"
						>
							<LogOut className="w-6 h-6" />
						</button>
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fade-in {
					animation: fade-in 0.3s ease-out;
				}
			`}</style>
		</header>
	)
}