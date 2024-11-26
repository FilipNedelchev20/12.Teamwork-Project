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
router.on('/details/:id', async (params) => {
    await loadFruitDetailsPage(params.id);
});
const fetchFruitDetails = async (id) => {
    try {
        const response = await fetch(`/api/fruits/${id}`);
        if (!response.ok) throw new Error('Failed to fetch fruit details');

        const fruit = await response.json();
        document.getElementById('fruit-name').textContent = fruit.name;
        document.getElementById('fruit-image').src = fruit.imageUrl;
        document.getElementById('fruit-description').textContent = fruit.description;
        document.getElementById('fruit-nutrition').innerHTML = fruit.nutrition.map(n => `<li>${n}</li>`).join('');
    } catch (error) {
        console.error(error);
        document.body.innerHTML = '<p>Failed to load fruit details.</p>';
    }
};

const loadFruitDetailsPage = async (id) => {
    document.body.innerHTML = ''; 
    document.body.innerHTML = await fetch('path/to/details.html').then(res => res.text()); 
    await fetchFruitDetails(id); 
};

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
