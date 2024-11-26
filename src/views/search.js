import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import * as service from '../api/data.js';

const cardTemplate = (fruit) => html`
	<div class="fruit-card">
		<img src=${fruit.imageUrl} alt="${fruit.name}" class="fruit-image" />
		<div class="fruit-info">
			<h3>${fruit.name}</h3>
			<p>${fruit.description}</p>
			<a href="/details/${fruit._id}" class="details-button">More Info</a>
		</div>
	</div>
`;


const searchTemplate = (fruits, onSubmit) => html`
	<section id="search-wrapper">
		<div id="search-bar">
			<h2>Search</h2>
			<form @submit=${onSubmit}>
				<input type="text" name="search" id="search-input" placeholder="Enter fruit name..." />
				<button type="submit" id="search-button">SEARCH</button>
			</form>
		</div>
		<h4>Results:</h4>
		<div id="search-results">
			${fruits.length > 0
				? fruits.map(cardTemplate)
				: html`<p class="no-results">No results found.</p>`}
		</div>
	</section>
`;


export async function searchPage(ctx) {
	let fruits = [];
	ctx.render(searchTemplate(fruits, onSubmit));

	async function onSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const query = formData.get('search').trim();

		if (query === '') {
			return alert('Field is required!');
		}

		fruits = await service.search(query);
		event.target.reset();
		ctx.render(searchTemplate(fruits, onSubmit));
	}
}
