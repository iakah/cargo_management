frappe.ui.form.on('Cargo Shipment', {
	// TODO: Formatter for warehouse receipt item?

	setup(frm) {
		frm.page.sidebar.toggle(false); // Hide Sidebar to better focus on the doc

		//frm.set_indicator_formatter("package", function(doc) {
		//	return 'orange';
		//});
	},

	onload(frm) {
		// Only packages on Warehouse Receipt
		// frm.set_query('package', 'cargo_shipment_lines', () => {
		//     return {
		//         filters: {status: 'Awaiting Departure'}
		//     }
		// });
	},


	refresh: function (frm) {
		// TODO: Add intro message when the cargo shipment is on a cargo shipment receipt
		// TODO: Add Progress: dashboard.add_progress or frappe.chart of type: percentage

		if (frm.is_new()) {
			return;
		}

		frm.page.indicator.parent().append(cargo_management.transportation_indicator(frm.doc.transportation));

		frm.events.build_custom_action_items(frm); // Adding Custom Action Items
	},

	build_custom_action_items(frm) {
		if (frm.doc.status === 'Awaiting Departure') {
			frm.page.add_action_item(__('Confirm Packages'), () => {
				frappe.call({
					method: 'cargo_management.shipment_management.doctype.cargo_shipment.actions.update_status',
					freeze: true,
					args: {
						source_doc_name: frm.doc.name,
						new_status: 'Awaiting Departure',
						msg_title: __('Confirmed Packages')
					}
				});
			});

			frm.page.add_action_item(__('Confirm Transit'), () => {
				frappe.call({
					method: 'cargo_management.shipment_management.doctype.cargo_shipment.actions.update_status',
					freeze: true,
					args: {
						source_doc_name: frm.doc.name, new_status: 'In Transit', msg_title: __('Now in Transit')
					} // TODO: Refresh DOC in callback
				});
			});
		} else {
			frm.page.clear_actions_menu();
		}
	}
});
