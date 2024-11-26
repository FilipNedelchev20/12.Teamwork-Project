import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import * as service from '../api/data.js';

const catalogTemplate = (fruits) => html`
	<section id="catalog">
		<h2>Fruits</h2>
		<div class="fruits-list">
			${fruits.length > 0
				? fruits.map(fruitCardTemplate) 
				: html`<p>No fruits available yet!</p>`} <!-- Handle empty catalog -->
		</div>
	</section>
`;

const fruitCardTemplate = (fruit) => html`
	<div class="fruit-card">
		<img src=${fruit.imageUrl} alt=${fruit.name} />
		<div class="fruit-info">
			<h3>${fruit.name}</h3>
			<p>${fruit.description}</p>
			<a href="/details/${fruit._id}" class="more-info">More Info</a>
		</div>
	</div>
`;

export async function catalogPage(ctx) {
	try {
		// Fetch all fruits from the API
		const fruits = await service.getAll(); 
		ctx.render(catalogTemplate(fruits));
	} catch (err) {
		console.error('Error loading fruits:', err);
		alert('Failed to load fruits. Please try again later.');
	}
}
