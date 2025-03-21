import axios from "axios";
import { action, makeAutoObservable, observable } from "mobx";

class OrderStore {
  userAddedItems: any = {
    users: {},
    totalItems: 0,
  };

  constructor() {
    makeAutoObservable(this, {
      userAddedItems: observable,
      setUserAddedItems: action,
      fetchUserOrders:action
    });
  }

  fetchUserOrders = async(sendData : any) => {
    try {
      const { data } = await axios.post(`/order/get`, {
        ...sendData,
        // company: stores.auth.getCurrentCompany(),
        // type : stores.auth.user?.role
      });
      const transformedData : any = {};

      data.data.forEach((book : any) => {
        const user = book.user[0]; // Assuming there's only one user per book
        const userEmail = user.username; // Extracting email from user object

        // Check if the user email already exists in the result object
        if (!transformedData[userEmail]) {
            transformedData[userEmail] = {}; // Create new entry if it doesn't exist
        }

        // Add the book to the user's entry
        transformedData[userEmail][book.orderReferenceId] = {
            _id: book.orderReferenceId,
            orderId : book.orderReferenceId,
            title: book.title,
            user: {
                username: user.username,
                _id: user._id,
            },
            company: book.company,
            description: book.description,
            image : book.image,
            TotalNoOfQuantities: book.quantity || 1
        };
    });

      this.userAddedItems.users = transformedData
      this.getTotalCounts(this.userAddedItems.users)
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response || err);
    }
  }

  getTotalCounts = (users: any) => {
    let totalCount = 0;

    Object.keys(users).forEach((userId) => {
      const userCart = users[userId];

      if (userCart && typeof userCart === "object") {
        totalCount += Object.keys(userCart).length;
      }
    });
    this.userAddedItems.totalItems = totalCount;
  };

  addAndUpdateOrder = async (sendData: any) => {
    try {
      const { data } = await axios.post(`/order/create`, {
        ...sendData,
        // company: store.auth.getCurrentCompany(),
      });
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response || err);
    }
  };

  setUserAddedItems = (
    type: any,
    item: any,
    action: "add" | "remove" | "removeAll",
    user: any,
    TotalNoOfQuantities: number = 1
  ) => {
    try {
      const userId = user.username;
      if (!this.userAddedItems.users[userId]) {
        this.userAddedItems.users[userId] = {};
      }

      if (action === "add") {
        if (TotalNoOfQuantities && TotalNoOfQuantities > 0) {
          if (!this.userAddedItems.users[userId][item._id]) {
            // Add new item with the specified quantity
            this.userAddedItems.users[userId][item._id] = {
              ...item,
              TotalNoOfQuantities: TotalNoOfQuantities,
            };

            this.addAndUpdateOrder({
              user: user?._id,
              orderId: item._id,
              title: item.title,
              description: item.description,
              image: item.image,
              quantity: TotalNoOfQuantities,
              type: type,
            })
              .then(() => {})
              .catch(() => {
              });
          } else {
            // Update the quantity of an existing item
            this.userAddedItems.users[userId][item._id].TotalNoOfQuantities +=
              TotalNoOfQuantities;

            this.addAndUpdateOrder({
              user: user?._id,
              orderId: item._id,
              title: item.title,
              description: item.description,
              image: item.image,
              quantity: this.userAddedItems.users[userId][item._id]
                .TotalNoOfQuantities, // Just set the updated quantity
              type: type,
            })
              .then(() => {})
              .catch(() => {
                alert("Error while updating item");
              });
          }

          this.getTotalCounts(this.userAddedItems.users);
        } else {
        }
      } else if (action === "remove" || action === "removeAll") {
        // Check for "remove" or "removeAll"
        if (this.userAddedItems.users[userId][item._id]) {
          if (action === "remove") {
            // Handle partial removal
            if (TotalNoOfQuantities && TotalNoOfQuantities > 0) {
              this.userAddedItems.users[userId][item._id].TotalNoOfQuantities -=
                TotalNoOfQuantities;

              this.addAndUpdateOrder({
                user: user?._id,
                orderId: item._id,
                title: item.title,
                description: item.description,
                image: item.image,
                quantity: this.userAddedItems.users[userId][item._id]
                  .TotalNoOfQuantities, // Set updated quantity
                type: type,
              })
                .then(() => {})
                .catch(() => {
                  alert("Error while updating item");
                });
            } else {
              this.userAddedItems.users[userId][item._id].TotalNoOfQuantities -= 1;
            }

            this.getTotalCounts(this.userAddedItems.users);

            // Remove the item if quantities drop to zero or below
            if (
              this.userAddedItems.users[userId][item._id].TotalNoOfQuantities <= 0
            ) {
              delete this.userAddedItems.users[userId][item._id];
              this.getTotalCounts(this.userAddedItems.users);
            }
          } else if (action === "removeAll") {
            // Handle complete removal
            delete this.userAddedItems.users[userId][item._id];
            this.getTotalCounts(this.userAddedItems.users);
          }
        }
      }
    } catch ({}) {
    }
  };

}

export const orderStore = new OrderStore()
