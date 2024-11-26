import { html, nothing } from '../../node_modules/lit-html/lit-html.js';
import * as service from '../api/data.js';

const detailsTemplate = (fruit, onDelete) => html`
	<section id="details">
		<div class="details">
			<h2>${fruit.name}</h2>
			<img src=${fruit.imageUrl} alt="fruit" />
			<p><strong>Description:</strong> ${fruit.description}</p>
			<p><strong>Nutrition:</strong> ${fruit.nutrition}</p>
			${fruit.isOwner
				? html`<div class="actions">
						<a href="/edit/${fruit._id}" class="button">Edit</a>
						<button @click=${onDelete} class="button">Delete</button>
				  </div>`
				: nothing}
		</div>
	</section>
`;

export async function detailsPage(ctx) {
	const id = ctx.params.id;
	const fruit = await service.getById(id);

	// Determine if the logged-in user is the owner of the fruit
	if (ctx.user) {
		fruit.isOwner = ctx.user._id === fruit._ownerId;
	}

	// Render the details page
	ctx.render(detailsTemplate(fruit, onDelete));

	// Delete handler
	async function onDelete() {
		const choice = confirm('Are you sure you want to delete this fruit?');
		if (choice) {
			await service.deleteById(id); // Call the delete service
			ctx.page.redirect('/'); // Redirect to the catalog
		}
	}
}
