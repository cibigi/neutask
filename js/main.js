$(function() {
	let counter= 0

	$("#view").sortable()

	if(localStorage.getItem("counter") === null) {
		localStorage.setItem("counter", counter)
	} else {
		counter= localStorage.getItem("counter")
	}

	if(counter>0) {
		for(let i= 1; i<=counter; i++) {
			if(localStorage.getItem(i) !== null) {
				let item= localStorage.getItem(i)
				let split= item.split(";")
				$("#view").append(`
					<div class="item" id="` + split[0] + `">
						<div class="data">
							<div style="display: flex; flex-direction: column; margin-top: 10px">
								<span style="font-size: 32px">` + split[1] + `</span>
							</div>
						</div>
						<div class="button" onclick="$('#` + split[0] + `').remove(); localStorage.removeItem(` + i + `)"><img class="icon" src="icons/delete_white_24dp.svg" style="padding: 10px" alt="Remove task"></div>
					</div>
				`)
			}
		}
	}

	$(window).on("scroll", function() {     
		var scroll = $(window).scrollTop()
		if(scroll>0) {
			$("#navbar").css("box-shadow", "10px 10px 20px #002e3f, -10px -10px 20px #003e55")
		} else {
			$("#navbar").css("box-shadow", "none")
		}
	})

	$("#search").on("input", function() {
		let value = $(this).val().toLowerCase();
		$("#view .item").filter(function() {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		})
	})

	$("#search").on("keypress", function(e) {
		if($("#search").val() !== "" && $("#search").val() !== " ") {
			if(e.key === "Enter") {
				if($("#nav").css("display") === "none") {
					$("#nav").show("slide", "fast")
					$("#adder").hide("slide", "fast")
				} else {
					$("#nav").hide("slide", "fast")
					$("#adder").show("slide", "fast")
				}
			}
		} 
	})

	$("#newname").on("input", function() {
		if($("#newname").val() !== "" && $("#newname").val() !== " ") {
			$("#add").show("slide", "fast")
		} else {
			$("#add").hide("slide", "fast")
		}
	})

	$("#newname").on("keypress", function(e) {
		if($("#newname").val() !== "" && $("#newname").val() !== " ") {
			if(e.key === "Enter") {
				$("#add").trigger("click")
			}
		} 
	})

	$(document).on("click", "#add", function() {
		if($("#newname").val() !== "" && $("#newname").val() !== " ") {
			counter++
			localStorage.setItem("counter", counter)
			let id= Math.floor(Math.random()*(999999-111111)+111111)
			localStorage.setItem(counter, id + ";" + $("#newname").val())
			$("#view").append(`
				<div class="item" id="` + id + `">
					<div class="data">
						<div style="display: flex; flex-direction: column; margin-top: 10px">
							<span style="font-size: 32px">` + $("#newname").val() + `</span>
						</div>
					</div>
					<div class="button" onclick="$('#` + id + `').remove(); localStorage.removeItem(` + counter + `)"><img class="icon" src="icons/delete_white_24dp.svg" style="padding: 10px" alt="Remove task"></div>
				</div>
			`)
			$("#newname").val("")
			$("#add").hide("slide", "fast")
		} else {
			alert("Error: unnamed tasks are not allowed.")
		}
		
	})

	$(document).on("click", "#export", function() {
		if(counter>0) {
			$("body").empty()
			$("body").append(`
				<header id="navbar">
					<button id="menubutton"><img class="icon" src="icons/menu_white_24dp.svg" style="padding: 10px" alt="Menu"></button>
					<span style="font-size: 32px; font-weight: 500;">Export</span>
				</header>

				<div id="nav" style="display: none;">
					<button id="about"><img class="icon" src="icons/info_white_24dp.svg" style="margin-right: 16px" alt="About">About</button>
					<button id="close"><img class="icon" src="icons/close_white_24dp.svg" style="margin-right: 16px; justify-self: flex-end;" alt="Close">Close</button>
				</div>

				<div id="exportnav" style="display: flex; justify-content: flex-end; margin: 30px;">
					<button onclick="location.reload()" style="margin: 10px;">Go back</button>
				</div>

				<textarea id="exportdata" readonly></textarea>
			`)

			for(let i= 1; i<=counter; i++) {
				if(localStorage.getItem(i) !== null) {
					$("#exportdata").append(localStorage.getItem(i) + "\n")
				}
			}

			let formattedData= $("#exportdata").html().replace(/\n/g, "%0D%0A")

			$("#exportnav").append('<a href="data:text/plain;charset=utf-8,' + formattedData + '" download="NeutaskExport.txt" style="color: #ecf0f1;"><button id="import" style="margin: 10px;">Download</button></a>')
		} else {
			alert("You have no tasks.")
		}
	})

	$(document).on("click", "#goimport", function() {
		$("body").empty()
		$("body").append(`
			<header id="navbar">
				<button id="menubutton"><img class="icon" src="icons/menu_white_24dp.svg" style="padding: 10px" alt="Menu"></button>
				<span style="font-size: 32px; font-weight: 500;">Import</span>
			</header>

			<div id="nav" style="display: none;">
				<button id="about"><img class="icon" src="icons/info_white_24dp.svg" style="margin-right: 16px" alt="About">About</button>
				<button id="close"><img class="icon" src="icons/close_white_24dp.svg" style="margin-right: 16px; justify-self: flex-end;" alt="Close">Close</button>
			</div>

			<textarea id="importdata" placeholder="Paste here your CSV data..." rows="10" style="margin-top: 30px;"></textarea>

			<div style="display: flex; justify-content: flex-end; margin: 30px;">
				<button onclick="location.reload()" style="margin: 10px;">Go back</button>
				<button id="import" style="margin: 10px;">Confirm</button>
			</div>
		`)
	})

	$(document).on("click", "#import", function() {
		if($("#importdata").val() !== "") {
			let myData= $("#importdata").val().split("\n")
			console.log(myData)
			for(i in myData) {
				counter++
				localStorage.setItem(counter, myData[i])
			}
			localStorage.setItem("counter", counter)
			alert("Done.")
			window.location= "index.html"
		} else {
			alert("No data to import.")
		}
	})

	$(document).on("click", "#clear", function() {
		let r= confirm("Are you sure?")

		if(r === true) {
			localStorage.clear()
			window.location.reload()
		}	
	})

	$(document).on("click", "#about", function() {
		alert("Neutask 0.9\ncibigi.github.io/neutask\nby Christian Battista Giannarelli\nReleased under GNU GPL v3.")
	})

	$(document).on("click", "#menubutton", function() {
		if($("#nav").css("display") === "none") {
			$("#nav").show("slide", "fast")
			$("#adder").hide("slide", "fast")
		} else {
			$("#nav").hide("slide", "fast")
			$("#adder").show("slide", "fast")
		}
	})

	$(document).on("click", "#close", function() {
		if($("#nav").css("display") === "none") {
			$("#nav").show("slide", "fast")
			$("#adder").hide("slide", "fast")
		} else {
			$("#nav").hide("slide", "fast")
			$("#adder").show("slide", "fast")
		}
	})
})