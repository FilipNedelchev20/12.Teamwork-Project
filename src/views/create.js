import { html } from '../../node_modules/lit-html/lit-html.js';
import { createSubmitHandler } from '../util.js';
import * as service from '../api/data.js';

const createTemplate = (onSubmit) => html`
	<section id="create">
		<div class="form">
			<h2>Add Fruit</h2>
			<form class="create-form" @submit=${onSubmit}>
				<input
					type="text"
					name="name"
					id="name"
					placeholder="Fruit Name"
				/>
				<input
					type="text"
					name="imageUrl"
					id="Fruit-image"
					placeholder="Fruit Image"
				/>
				<textarea
					id="fruit-description"
					name="description"
					placeholder="Description"
					rows="10"
					cols="50"
				></textarea>
				<textarea
					id="fruit-nutrition"
					name="nutrition"
					placeholder="Nutrition"
					rows="10"
					cols="50"
				></textarea>
				<button type="submit">Add Fruit</button>
			</form>
		</div>
	</section>
`;

export function createPage(ctx) {
	ctx.render(createTemplate(createSubmitHandler(ctx, onSubmit)));
}

async function onSubmit(ctx, data, event) {
	
	if (!data.name.trim() || !data.imageUrl.trim() || !data.description.trim() || !data.nutrition.trim()) {
		alert("All fields are required!");
		return; 
	}

	
	await service.create({
		name: data.name.trim(),
		imageUrl: data.imageUrl.trim(),
		description: data.description.trim(),
		nutrition: data.nutrition.trim(),
	});

	
	event.target.reset();
	ctx.page.redirect('/');
}
