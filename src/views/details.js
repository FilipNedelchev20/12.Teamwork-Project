import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import * as service from '../api/data.js';

const detailsTemplate = (fruit, onDelete) => html`
	<section id="details-wrapper">
		<h2 id="details-title">${fruit.name}</h2>
		<img src=${fruit.imageUrl} alt="${fruit.name}" />
		<div id="details-description">
			<p>${fruit.description}</p>
			<h4 id="nutrition">Nutrition</h4>
			<p>${fruit.nutrition}</p>
		</div>
		${fruit.isOwner
			? html`
					<div id="action-buttons">
						<a href="/edit/${fruit._id}">Edit</a>
						<a href="javascript:void(0)" @click=${onDelete}>Delete</a>
					</div>
			  `
			: nothing}
	</section>
`;

export async function detailsPage(ctx) {
	const id = ctx.params.id;

	// Fetch the fruit details from the server
	const fruit = await service.getById(id);

	// Check if the logged-in user is the owner of the fruit
	if (ctx.user) {
		fruit.isOwner = ctx.user._id === fruit._ownerId;
	}

	// Render the details template with the fruit data and delete handler
	ctx.render(detailsTemplate(fruit, onDelete));

	// Delete handler function
	async function onDelete() {
		const choice = confirm('Are you sure you want to delete this fruit?');
		if (choice) {
			await service.deleteById(id); // Delete the fruit by ID
			ctx.page.redirect('/catalog'); // Redirect back to the catalog
		}
	}
}
