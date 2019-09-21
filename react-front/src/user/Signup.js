import React, { Component } from 'react'
import { signup } from '../auth'
import { Link } from 'react-router-dom'
class Signup extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "",
			email: "",
			password: "",
			error: "",
			about: "",
			open: false
		}
	}

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value, error: "" })
	}

	clickSubmit = event => {
		event.preventDefault();
		const { name, email, password, about } = this.state;
		const user = {
			name,
			email,
			password,
			about
		}
		// console.log(user)

		signup(user)
			.then(data => {
				console.log("dtaa ==>", data)
				if (data.error) {
					this.setState({ error: data.error })
				} else {
					this.setState({
						name: "",
						email: "",
						password: "",
						error: "",
						about: "",
						open: true
					})
				}

			})
	}

	signupForm = (name, email, password, about) => {
		return (
			<form>
				<div className="form-group">
					<label className="text-muted">Name</label>
					<input
						onChange={this.handleChange("name")}
						type="text"
						value={name}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<label className="text-muted">Email</label>
					<input
						onChange={this.handleChange("email")}
						type="email"
						value={email}
						className="form-control"
					/>
				</div>

				<div className="form-group">
					<label className="text-muted">About</label>
					<textarea
						onChange={this.handleChange("about")}
						type="text"
						value={about}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<label className="text-muted">Password</label>
					<input
						onChange={this.handleChange("password")}
						type="password"
						className="form-control"
						value={password}
					/>
				</div>
				<button className="btn btn-raised btn-primary" onClick={this.clickSubmit}>Submit</button>
			</form>
		)
	}
	render() {

		const { name, email, password, error, open, about } = this.state;

		return (
			<div className="container">
				<h2 className="mt-5 mb-5">Signup</h2>
				<div className="alert alert-danger" style={{ display: error ? "block" : "none" }}>
					{error}
				</div>
				<div className="alert alert-info" style={{ display: open ? "block" : "none" }}>
					New account successfully created. Please
					<Link to="/signin">Sign In</Link>.
				</div>
				{this.signupForm(name, email, password, about)}
			</div>
		)
	}
}
export default Signup;